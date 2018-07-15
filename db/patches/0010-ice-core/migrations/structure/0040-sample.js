exports.up = function (knex, Promise) {
  return knex.raw(upScript)
}

exports.down = function (knex, Promise) {
  return knex.raw(downScript)
}

const downScript = `
DROP TABLE IF EXISTS corz.sample CASCADE;
`

const upScript = `
CREATE TABLE corz.sample (
  id uuid UNIQUE NOT NULL DEFAULT uuid_generate_v1(),
  created_at timestamp with time zone NOT NULL DEFAULT current_timestamp,
  updated_at timestamp with time zone NOT NULL DEFAULT current_timestamp,
  core_id uuid NOT NULL,
  top_depth float,
  top_age float,
  bottom_depth float,
  bottom_age float,
	CONSTRAINT pk_sample PRIMARY KEY ( id )
 );
--||--
GRANT select, update, delete ON TABLE corz.sample TO corz_user, corz_anonymous;
--||--
ALTER TABLE corz.sample
ADD CONSTRAINT fk_sample_core
FOREIGN KEY ( core_id )
REFERENCES corz.core( id )
ON DELETE CASCADE;
--||--
CREATE INDEX ON sample(top_depth);
`
