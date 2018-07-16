# ice-cores api#

```
npm i
```

copy **/config/example.js** --> **/config.index.js**
```
cp ./config/example.js ./config/index.js
```

edit /config/index.js to point to your chosen database
```
process.env.PORT = 3000
process.env.DB_CONNECTION_STRING = 'postgres://corz:pwd4corz@localhost/corz'
process.env.SCHEMAS_TO_GRAPHQL = 'corz'
process.env.PG_DEFAULT_ROLE = 'corz_anonymous'
process.env.GRAPHIQL = false
process.env.JWT_PG_TYPE_IDENTIFIER = 'corz.jwt_token'
process.env.JWT_SECRET = 'changethissecret'
process.env.DISABLE_DEFAULT_MUTATIONS = true
```