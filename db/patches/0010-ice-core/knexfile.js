const connection = process.env.DB_CONNECTION_STRING ? process.env.DB_CONNECTION_STRING : {
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  port: process.env.PG_PORT
}

console.log("connection", connection);

function buildKnexfile () {
  return {
    patch_0_0_1_0_structure: {
      client: 'postgresql',
      connection: connection,
      migrations: {
        directory: `${__dirname}\\migrations\\structure`,
        tableName: 'public.knex_migrations_patch_0_0_1_0_structure'
      },
    },
    patch_0_0_1_0_functions: {
      client: 'postgresql',
      connection: connection,
      migrations: {
        directory: `${__dirname}\\migrations\\functions`,
        tableName: 'public.knex_migrations_patch_0_0_1_0_functions'
      },
    },
    patch_0_0_1_0_views: {
      client: 'postgresql',
      connection: connection,
      migrations: {
        directory: `${__dirname}\\migrations\\views`,
        tableName: 'public.knex_migrations_patch_0_0_1_0_views'
      },
    },
  }
}

module.exports = buildKnexfile
