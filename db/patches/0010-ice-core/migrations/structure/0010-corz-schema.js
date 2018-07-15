exports.up = function (knex, Promise) {
  return knex.raw(upScript)
}

exports.down = function (knex, Promise) {
  return knex.raw(downScript)
}

const downScript = `
DROP SCHEMA IF EXISTS corz CASCADE;
`

const upScript = `
--||--
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
--||--
DROP SCHEMA IF EXISTS corz CASCADE;
--||--
CREATE SCHEMA corz;
--||--
GRANT usage ON SCHEMA corz TO corz_anonymous;
--||--
ALTER DEFAULT PRIVILEGES REVOKE EXECUTE ON FUNCTIONS FROM public;
`
