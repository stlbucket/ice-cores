
exports.up = function (knex, Promise) {
  return knex.raw(upScript)
}

exports.down = function (knex, Promise) {
  return knex.raw(downScript)
}

const downScript = `
--   DO
--   $body$
--   BEGIN
--     IF EXISTS (
--       SELECT    *
--       FROM   pg_catalog.pg_roles
--       WHERE  rolname = 'corz_super_admin'
--     ) THEN
--       DROP OWNED BY corz_super_admin;
--       DROP ROLE corz_super_admin;
--     END IF;
--   END
--   $body$;
--   --||--
--   DO
--   $body$
--   BEGIN
--     IF EXISTS (
--       SELECT    *
--       FROM   pg_catalog.pg_roles
--       WHERE  rolname = 'corz_admin'
--     ) THEN
--       DROP OWNED BY corz_admin;
--       DROP ROLE corz_admin;
--     END IF;
--   END
--   $body$;
--   --||--
--   DO
--   $body$
--   BEGIN
--     IF EXISTS (
--       SELECT    *
--       FROM   pg_catalog.pg_roles
--       WHERE  rolname = 'corz_user'
--     ) THEN
--       DROP OWNED BY corz_user;
--       DROP ROLE corz_user;
--     END IF;
--   END
--   $body$;
--   --||--
--   DO
--   $body$
--   BEGIN
--     IF EXISTS (
--       SELECT    *
--       FROM   pg_catalog.pg_roles
--       WHERE  rolname = 'corz_anonymous'
--     ) THEN
--       DROP OWNED BY corz_anonymous;
--       DROP ROLE corz_anonymous;
--     END IF;
--   END
--   $body$;
`

const upScript = `
  DO
  $body$
  BEGIN
    IF NOT EXISTS (
      SELECT    *
      FROM   pg_catalog.pg_roles
      WHERE  rolname = 'corz_super_admin'
    ) THEN
      CREATE ROLE corz_super_admin;
    END IF;
  END
  $body$;
  --||--
  DO
  $body$
  BEGIN
    IF NOT EXISTS (
      SELECT    *
      FROM   pg_catalog.pg_roles
      WHERE  rolname = 'corz_admin'
    ) THEN
      CREATE ROLE corz_admin;
      GRANT corz_admin TO corz_super_admin;
    END IF;
  END
  $body$;
  --||--
  DO
  $body$
  BEGIN
    IF NOT EXISTS (
      SELECT    *
      FROM   pg_catalog.pg_roles
      WHERE  rolname = 'corz_user'
    ) THEN
      CREATE ROLE corz_user;
      GRANT corz_user TO corz_super_admin;
      GRANT corz_user TO corz_admin;
    END IF;
  END
  $body$;
  --||--
  DO
  $body$
  BEGIN
    IF NOT EXISTS (
      SELECT    *
      FROM   pg_catalog.pg_roles
      WHERE  rolname = 'corz_anonymous'
    ) THEN
      CREATE ROLE corz_anonymous;
      GRANT corz_anonymous TO corz_super_admin;
      GRANT corz_anonymous TO corz_admin;
      GRANT corz_anonymous TO corz_user;
    END IF;
  END
  $body$;
`
