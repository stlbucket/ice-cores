#!/usr/bin/env node
require('../../config')
const clog = require('fbkt-clog')
const pgClient = require('../../src/pgClient')
const sql = 'select corz.build_test_core_set(5); select * from corz.vw_core_summary;'
// const sql2 = 'select * from corz.vw_core_summary;'

pgClient()
.then(client => {
  return client.query(sql)
  // .then(res1 => {
    // return client.query(sql2)
  // })
})
.then(result => {
    clog('RESULT', result.rows)
    process.exit()
  })
  .catch(error => {
    clog.error('ERROR', error)
    process.exit()
  })
