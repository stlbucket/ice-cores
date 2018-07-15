#!/usr/bin/env bash

knex-migrate up --env patch_0_0_1_0_views
knex-migrate up --env patch_0_0_1_0_functions
