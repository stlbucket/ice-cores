const clog = require('fbkt-clog');

const executeSql = require('./executeSql');

function processData(workspace){
  return workspace.importInfo.buildImportSql(workspace)
    .then(importSql => {
      return executeSql(importSql, workspace.importInfo.pgClient);
    })
    .then(importResult => {
      return { processingResult: `Imported ${importResult.rowCount} records` };
    })
    .catch(error => {
      clog.error('ERROR PROCESSING IMPORT DATA', error);
    });
}

module.exports = processData;