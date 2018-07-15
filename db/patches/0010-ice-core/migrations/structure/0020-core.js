exports.up = function (knex, Promise) {
  return knex.raw(upScript)
}

exports.down = function (knex, Promise) {
  return knex.raw(downScript)
}

const downScript = `
DROP TABLE IF EXISTS corz.core CASCADE;
`

const upScript = `
CREATE TABLE corz.core (
  id uuid UNIQUE NOT NULL DEFAULT uuid_generate_v1(),
  created_at timestamp with time zone NOT NULL DEFAULT current_timestamp,
  updated_at timestamp with time zone NOT NULL DEFAULT current_timestamp,
  name text UNIQUE NOT NULL,
  location text NULL,
	CONSTRAINT pk_core PRIMARY KEY ( id )
 );
--||--
GRANT select, update, delete ON TABLE corz.core TO corz_user, corz_anonymous;
`
