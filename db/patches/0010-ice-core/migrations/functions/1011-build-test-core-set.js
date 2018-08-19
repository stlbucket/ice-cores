exports.up = function (knex, Promise) {
  return knex.raw(upScript)
}

exports.down = function (knex, Promise) {
  return knex.raw(downScript)
}

const downScript = `
DROP FUNCTION IF EXISTS build_test_core();
`

const upScript = `
-- Function: build_test_core()

-- DROP FUNCTION build_test_core();

CREATE OR REPLACE FUNCTION build_test_core(
)
  RETURNS corz.core AS
$BODY$
declare
  _core corz.core;
begin  

  return _core;
end;
$BODY$
  LANGUAGE plpgsql VOLATILE STRICT SECURITY DEFINER
  COST 100;
ALTER FUNCTION build_test_core()
  OWNER TO soro;
GRANT EXECUTE ON FUNCTION build_test_core() TO corz_user;
REVOKE ALL ON FUNCTION build_test_core() FROM public;
`
