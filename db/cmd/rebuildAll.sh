#!/bin/bash 
# dropdb corz
# createdb corz
# ./patches/0010-ice-core/dbMigrationScripts/up-everything.sh
# ./cmd/loadCore/index.js
# ./dev/execute.sh summary
./cmd/loadTestCore/index.js
./dev/execute.sh summary