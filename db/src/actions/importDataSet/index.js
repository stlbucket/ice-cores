const clog = require('fbkt-clog');

const createStagingTable = require('./createStagingTable');
const streamToDb = require('./streamToDb');
const processData = require('./processData');
const dropStagingTable = require('./dropStagingTable');

function importDataSet(startingWorkspace){
  const stagingTable = `${startingWorkspace.importInfo.stagingSchema}.${startingWorkspace.importInfo.primaryEntityName}_${startingWorkspace.importInfo.uploadId.split('-').join('_')}`;
  const workspace = Object.assign(startingWorkspace, {
    stagingTable: stagingTable
  });

  return createStagingTable(workspace)
    .then(() => {
      return workspace;
    })
    .then(workspace => {
      return streamToDb(workspace)
        .then(dbTableResult => {
          return Object.assign(workspace, dbTableResult);
        });
    })
    .then(workspace => {
      return processData(workspace)
        .then(processDataResult => {
          return Object.assign(workspace, processDataResult);
        })
    })
    .then(workspace => {
      return dropStagingTable(workspace)
        .then(() => {
          return workspace;
        })
    })
    .catch(error => {
      clog('ERROR IMPORTING DATA SET', error);
      throw error;
    });
}

module.exports = importDataSet;


