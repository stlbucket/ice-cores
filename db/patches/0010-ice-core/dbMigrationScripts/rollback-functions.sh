#!/usr/bin/env bash

knex-migrate rollback --env patch_0_0_1_0_functions
knex-migrate rollback --env patch_0_0_1_0_views
