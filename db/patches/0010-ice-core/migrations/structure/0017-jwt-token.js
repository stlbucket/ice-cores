
exports.up = function (knex, Promise) {
  return knex.raw(upScript)
}

exports.down = function (knex, Promise) {
  return knex.raw(downScript)
}

const downScript = `
DROP TYPE IF EXISTS corz.jwt_token;
`

const upScript = `
--||--
create type corz.jwt_token as (
  role text,
  contact_id uuid,
  user_token uuid
);
`
