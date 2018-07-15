const Promise = require('bluebird');
const clog    = require('fbkt-clog');
const copyFrom = require('pg-copy-streams').from;

const validateHeaderRow = require('./validateHeaderRow');

function streamToDb(workspace){
  const d = Promise.defer();

  workspace.importInfo.pgClient()
    .then(client => {
      return client.query(copyFrom(`COPY ${workspace.stagingTable} FROM STDIN CSV DELIMITER E',' HEADER`));
    })
    .then(copyFromStream => {

      copyFromStream.on('end', function () {
        d.resolve({
          stagingTable: workspace.stagingTable
        });
      });
      workspace.readStream
        .pipe(copyFromStream);
    });

  return d.promise;
}

module.exports = streamToDb;