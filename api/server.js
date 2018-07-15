require('./config')
const express = require('express')
const postgraphql = require('postgraphile').postgraphql;
const app = express()
// const mutationHooks = require('./src/mutationHooks')

app.use(express.static('dist'))

app.get('/', (req, res) => {
  res.redirect('/dist/index.html')
})

// app.use('/api', api)
const connection = process.env.DB_CONNECTION_STRING ? process.env.DB_CONNECTION_STRING : {
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  port: process.env.PG_PORT
}

const schema = postgraphql(
  connection,
  [ 'corz', 'corz_staging' ],
  {
    graphiql: process.env.GRAPHIQL === 'true',
    pgDefaultRole: process.env.PG_DEFAULT_ROLE,
    jwtPgTypeIdentifier: process.env.JWT_PG_TYPE_IDENTIFIER,
    jwtSecret: process.env.JWT_SECRET,
    disableDefaultMutations: process.env.DISABLE_DEFAULT_MUTATIONS === 'true',
    // appendPlugins: mutationHooks,
    showErrorStack: true,
    dynamicJson: true,
    graphileBuildOptions: {
      connectionFilterOperatorNames: {
        equalTo: "eq",
        notEqualTo: "ne",
        lessThan: "lt",
        lessThanOrEqualTo: "lte",
        greaterThan: "gt",
        greaterThanOrEqualTo: "gte",
        in: "in",
        notIn: "nin",
        contains: "cont",
        notContains: "ncont",
        containsInsensitive: "conti",
        notContainsInsensitive: "nconti",
        startsWith: "starts",
        notStartsWith: "nstarts",
        startsWithInsensitive: "startsi",
        notStartsWithInsensitive: "nstartsi",
        endsWith: "ends",
        notEndsWith: "nends",
        endsWithInsensitive: "endsi",
        notEndsWithInsensitive: "nendsi",
        like: "like",
        notLike: "nlike",
        likeInsensitive: "ilike",
        notLikeInsensitive: "nilike",
      },
      extendedErrors: 'hint, detail, errcode'
    }
  }
)

app.use(schema)

app.listen(process.env.PORT)

console.log(`listening on ${process.env.PORT}`)
