# ice-cores db #

this repo manages database migrations

prerequisite:
```
npm install -g knex-migrate
```
install 
```
npm install
```

copy **/config/example.js** --> **/config.index.js**
```
cp ./config/example.js ./config/index.js
```

edit /config/index.js to point to your chosen database
```
process.env.DATABASE_URL = 'postgres://USER:PASSWORD@localhost/corz'
```
build the db
```
./patches/0010-ice-core/dbMigrationScripts/up-everything.sh
```
load the test core
```
node ./cmd/loadCore/
```