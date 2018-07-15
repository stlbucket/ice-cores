exports.up = function (knex, Promise) {
  return knex.raw(upScript)
}

exports.down = function (knex, Promise) {
  return knex.raw(downScript)
}

const downScript = `
DROP VIEW IF EXISTS corz.vw_core_data;
`

const upScript = `
CREATE VIEW corz.vw_core_data AS (
  SELECT
    c.id,
    c.name,
    sa.id as sample_id,
    sa.top_depth,
    sa.bottom_depth,
    sa.top_age,
    sa.bottom_age,
    ( select json_agg(data)
      from (
        select dpt.name, dp.value 
        from corz.data_point_type dpt
        join corz.data_point dp on dp.data_point_type_id = dpt.id
        join corz.sample sam on dp.sample_id = sam.id
        where sam.id = sa.id
      ) as data
    ) as data
    from corz.core c
    join corz.sample sa on sa.core_id = c.id
    order by sa.top_depth
);
--||--
GRANT select, update, delete ON TABLE corz.vw_core_data TO corz_user, corz_anonymous;
`
