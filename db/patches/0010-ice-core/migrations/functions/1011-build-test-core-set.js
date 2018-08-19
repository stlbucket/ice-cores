exports.up = function (knex, Promise) {
  return knex.raw(upScript)
}

exports.down = function (knex, Promise) {
  return knex.raw(downScript)
}

const downScript = `
DROP FUNCTION IF EXISTS build_test_core_set(integer);
`

const upScript = `
-- Function: build_test_core_set(integer)

-- DROP FUNCTION build_test_core_set(integer);

CREATE OR REPLACE FUNCTION build_test_core_set(
  _num integer
)
  RETURNS integer AS
$BODY$
declare
  _core_count integer;
begin
  FOR _core_count IN 1.._num LOOP
    PERFORM corz.build_test_core();
  END LOOP;

  select
    count(*)
  into _core_count
  from corz.core; 

  return _core_count;
end;
$BODY$
  LANGUAGE plpgsql VOLATILE STRICT SECURITY DEFINER
  COST 100;
ALTER FUNCTION build_test_core_set(integer)
  OWNER TO soro;
GRANT EXECUTE ON FUNCTION build_test_core_set(integer) TO corz_user;
REVOKE ALL ON FUNCTION build_test_core_set(integer) FROM public;

`
