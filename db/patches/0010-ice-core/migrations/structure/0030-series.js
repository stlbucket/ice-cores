exports.up = function (knex, Promise) {
  return knex.raw(upScript)
}

exports.down = function (knex, Promise) {
  return knex.raw(downScript)
}

const downScript = `
DROP TABLE IF EXISTS corz.series CASCADE;
`

const upScript = `
CREATE TABLE corz.series (
  id uuid UNIQUE NOT NULL DEFAULT uuid_generate_v1(),
  created_at timestamp with time zone NOT NULL DEFAULT current_timestamp,
  updated_at timestamp with time zone NOT NULL DEFAULT current_timestamp,
  name text NOT NULL,
  core_id uuid NOT NULL,
  data_point_type_id uuid NOT NULL,
	CONSTRAINT pk_series PRIMARY KEY ( id )
 );
--||--
GRANT select, update, delete ON TABLE corz.series TO corz_user, corz_anonymous;
--||--
ALTER TABLE corz.series
ADD CONSTRAINT fk_series_core
FOREIGN KEY ( core_id )
REFERENCES corz.core( id )
ON DELETE CASCADE;
`
