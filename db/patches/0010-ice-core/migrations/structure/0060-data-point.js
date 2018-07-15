exports.up = function (knex, Promise) {
  return knex.raw(upScript)
}

exports.down = function (knex, Promise) {
  return knex.raw(downScript)
}

const downScript = `
DROP TABLE IF EXISTS corz.data_point CASCADE;
`

const upScript = `
CREATE TABLE corz.data_point (
  id uuid UNIQUE NOT NULL DEFAULT uuid_generate_v1(),
  created_at timestamp with time zone NOT NULL DEFAULT current_timestamp,
  updated_at timestamp with time zone NOT NULL DEFAULT current_timestamp,
  value float NOT NULL,
  sample_id uuid NOT NULL,
  data_point_type_id uuid NOT NULL,
  series_id uuid NOT NULL,
	CONSTRAINT pk_data_point PRIMARY KEY ( id )
 );
--||--
GRANT select, update, delete ON TABLE corz.data_point TO corz_user, corz_anonymous;
--||--
ALTER TABLE corz.data_point
ADD CONSTRAINT fk_data_point_data_point_type
FOREIGN KEY ( data_point_type_id )
REFERENCES corz.data_point_type( id );
--||--
ALTER TABLE corz.data_point
ADD CONSTRAINT fk_data_point_series
FOREIGN KEY ( series_id )
REFERENCES corz.series( id )
ON DELETE CASCADE;
--||--
ALTER TABLE corz.data_point
ADD CONSTRAINT fk_data_point_sample
FOREIGN KEY ( sample_id )
REFERENCES corz.sample( id )
ON DELETE CASCADE;
--||--
CREATE INDEX ON corz.data_point(sample_id);
`
