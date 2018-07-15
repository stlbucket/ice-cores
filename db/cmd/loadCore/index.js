require('../../config')
const clog = require('fbkt-clog');
const uuid = require('uuid');
const buildImportSql = require('./buildImportSql');
const importDataSet = require('../../src/actions/importDataSet');
const pgClient = require('../../src/pgClient');
const getReadStream = require('./getReadStream');

const filename = './testCores/GreenlandIceCoreData.csv';
// const filename = './testCores/GISP2.csv';
const importInfo = {
  name: 'GISP2',
  location: `72°35''46.4"N 38°25''19.1"W`,
  // name: uuid.v4(),
  uploadId: uuid.v4(),
  filename: filename,
  stagingSchema: 'corz_staging',
  primaryEntityName: 'core',
  fields: [ "TopDepth", "BottomDepth", "NO3_ppb", "NO3_uM", "TopAge"," BottomAge" ],
  dataPointTypes: ["NO3_ppb", "NO3_uM" ],
  buildImportSql: buildImportSql,
  pgClient: pgClient
};

getReadStream(importInfo.filename)
  .then(readStream => {
    const workspace = {
      readStream: readStream,
      importInfo: importInfo
    };

    return importDataSet(workspace);
  })
  .then(result => {
    clog('RESULT', result);
    process.exit();
  })
  .catch(error => {
    clog.error('ERROR', error);
    process.exit();
  });
