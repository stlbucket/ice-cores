const Promise = require('bluebird');
const _ = require('lodash');
const clog = require('fbkt-clog');

function createStagingTable(workspace){
  return Promise.resolve(buildScript(workspace))
    .then(script => {
      return executeScript(workspace, script);
    })
    .catch(error => {
      clog('ERROR CREATING IMPORT TABLE', error);
      throw error;
    })
}

function executeScript(workspace, script){
  return workspace.importInfo.pgClient()
    .then(client => {
      return client.query(script);
    })
}

function buildScript(workspace){

  return `
CREATE TABLE ${workspace.stagingTable} (${
  workspace.importInfo.fields.map(
    field => {
      return `\n  ${_.snakeCase(field)} text NULL`
      // return `\n  "${field}" text NULL`
    }
  )
}
);
  `;
}

module.exports = createStagingTable;