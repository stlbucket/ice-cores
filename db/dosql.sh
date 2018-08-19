#!/usr/bin/env bash
source ./config/migration.config.sh
echo -d $database -h $hostname
echo script: $1
psql -U $username -f $1 -d $database -h $hostname
