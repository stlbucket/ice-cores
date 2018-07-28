exports.up = function (knex, Promise) {
  return knex.raw(upScript)
}

exports.down = function (knex, Promise) {
  return knex.raw(downScript)
}

const downScript = `
DROP VIEW IF EXISTS corz.vw_core_summary;
`

const upScript = `
CREATE VIEW corz.vw_core_summary AS (
  SELECT
    c.id,
    c.name,
    c.location,
    ( select count(*) from corz.sample where core_id = c.id ) as sample_count,
    ( select json_agg(series_name) 
      from ( 
        select 
          name,
          ( select count(*) from corz.data_point dp where dp.series_id = se.id ) as data_point_count
        from corz.series se
        where core_id = c.id 
      ) as series_name 
    ) as available_series
    from corz.core c
);
--||--
GRANT select, update, delete ON TABLE corz.vw_core_summary TO corz_user, corz_anonymous;
`
