exports.up = function (knex, Promise) {
  return knex.raw(upScript)
}

exports.down = function (knex, Promise) {
  return knex.raw(downScript)
}

const downScript = `
DROP TABLE IF EXISTS corz.data_point_type CASCADE;
`

const upScript = `
CREATE TABLE corz.data_point_type (
  id uuid UNIQUE NOT NULL DEFAULT uuid_generate_v1(),
  created_at timestamp with time zone NOT NULL DEFAULT current_timestamp,
  updated_at timestamp with time zone NOT NULL DEFAULT current_timestamp,
  name text NOT NULL UNIQUE CHECK (name <> ''),
	CONSTRAINT pk_data_point_type PRIMARY KEY ( id )
 );
--||--
GRANT select, update, delete ON TABLE corz.data_point_type TO corz_user, corz_anonymous;
--||--
ALTER TABLE corz.series
ADD CONSTRAINT fk_series_data_point_type
FOREIGN KEY ( data_point_type_id )
REFERENCES corz.data_point_type( id );
`
