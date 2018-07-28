const Promise = require('bluebird');
const clog    = require('fbkt-clog');
const copyFrom = require('pg-copy-streams').from;

const validateHeaderRow = require('./validateHeaderRow');

function streamToDb(workspace){
  const d = Promise.defer();
  const query = `COPY ${workspace.stagingTable} FROM STDIN CSV DELIMITER E',' HEADER`
  clog('query', query)
  let cli;

  workspace.importInfo.pgClient()
    .then(client => {
      cli = client
      return client.query(copyFrom(query));
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