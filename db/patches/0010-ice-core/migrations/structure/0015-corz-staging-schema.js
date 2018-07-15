exports.up = function (knex, Promise) {
  return knex.raw(upScript)
}

exports.down = function (knex, Promise) {
  return knex.raw(downScript)
}

const downScript = `
DROP SCHEMA IF EXISTS corz_staging CASCADE;
`

const upScript = `
--||--
DROP SCHEMA IF EXISTS corz_staging CASCADE;
--||--
CREATE SCHEMA corz_staging;
--||--
GRANT usage ON SCHEMA corz_staging TO corz_anonymous;
--||--
ALTER DEFAULT PRIVILEGES REVOKE EXECUTE ON FUNCTIONS FROM public;
`
