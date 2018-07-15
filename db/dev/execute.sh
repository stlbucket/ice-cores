#!/usr/bin/env bash
source ./config/migration.config.sh
echo -d $database -h $hostname
echo script: $1
psql -U $username -f dev/$1.sql -d $database -h $hostname
