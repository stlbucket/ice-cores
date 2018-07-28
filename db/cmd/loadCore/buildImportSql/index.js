const clog = require('fbkt-clog')
const Promise = require('bluebird');
const _ = require('lodash');


function buildImportSql(workspace){
  const iceCoreInfo = workspace.importInfo;
  const stagingTable = workspace.stagingTable;

  clog('iceCoreInfo', iceCoreInfo)
  
  const sql = `
delete from corz.core where name = '${iceCoreInfo.name}';

-- core -----------------------------------------------------------------------------------------
insert into corz.core (
  name,
  location
)
select
  '${iceCoreInfo.name}',
  '${iceCoreInfo.location}'
where not exists (
  select id from corz.core where name = '${iceCoreInfo.name}'
);
-- end core -------------------------------------------------------------------------------------



-- add core_id to staging table -----------------------------------------------------------------
DO $$
  BEGIN
    BEGIN
      alter table ${stagingTable}
      add column core_id uuid;
    EXCEPTION
      WHEN duplicate_column THEN RAISE NOTICE 'column core_id already exists in ${stagingTable}.';
    END;
  END;
$$;

update ${stagingTable}
set core_id = (
  select id from corz.core where name = '${iceCoreInfo.name}'
);
-- end add core_id to staging table -------------------------------------------------------------



-- data_point_types ---------------------------------------------------------------------------------
${iceCoreInfo.dataPointTypes.reduce(
  (acc, dataPointType) => {
    return acc.concat(`
insert into corz.data_point_type (
  name
)
select
  '${dataPointType}'
where not exists (
  select id
  from corz.data_point_type
  where name = '${dataPointType}'
);
`)
  },
  '')
}
-- end data_point_types -----------------------------------------------------------------------------



-- series -------------------------------------------------------------------------------------------
${iceCoreInfo.dataPointTypes.reduce(
    (acc, dataPointType) => {
      return acc.concat(`
insert into corz.series (
  core_id,
  data_point_type_id,
  name
)
select
  ( select id from corz.core where name = '${iceCoreInfo.name}' ),
  ( select id from corz.data_point_type where name = '${dataPointType}' ),
  ( select '${dataPointType}' )
where not exists (
  select id
  from corz.series
  where core_id = ( select id from corz.core where name = '${iceCoreInfo.name}' )
  and data_point_type_id = ( select id from corz.data_point_type where name = '${dataPointType}' )
);
`)
    },
    '')
}
-- end series ---------------------------------------------------------------------------------------



-- sample -------------------------------------------------------------------------------------------

insert into corz.sample (
  core_id,
  top_depth,
  bottom_depth,
  top_age,
  bottom_age
)
select
  core_id,
  top_depth :: float,
  bottom_depth :: float,
  top_age :: float,
  bottom_age :: float
from ${stagingTable}
where core_id = ( select id from corz.core where name = '${iceCoreInfo.name}' )
;

-- end sample ---------------------------------------------------------------------------------------



-- data point ---------------------------------------------------------------------------------------
${iceCoreInfo.dataPointTypes.reduce(
    (acc, dataPointType) => {
      return acc.concat(`
insert into corz.data_point (
  sample_id,
  series_id,
  data_point_type_id,
  value
)
select
  sa.id,
  se.id,
  dpt.id,
  ics.${_.snakeCase(dataPointType)} :: float
from ${stagingTable} ics
join corz.core c on c.id = ( select id from corz.core where name = '${iceCoreInfo.name}' )
join corz.sample sa on sa.core_id = c.id and sa.top_depth = ics.top_depth :: float
join corz.series se on se.core_id = c.id
join corz.data_point_type dpt on dpt.id = se.data_point_type_id
where dpt.name = '${dataPointType}';
`)
    },
    '')
    }
-- end data point -----------------------------------------------------------------------------------

`;

  // clog('THE SQL', sql);
  return Promise.resolve(sql);
}

module.exports = buildImportSql;