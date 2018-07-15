const Promise = require('bluebird');
const clog    = require('fbkt-clog');

const requiredFields = [ 'TopDepth', 'BottomDepth', 'TopAge', 'BottomAge' ];

function validateHeaderRow(headerRow){
  const headerFields = headerRow.split(',');

  return requiredFields.map(
    requiredField => {
      if (headerFields.indexOf(requiredField) === -1) {
        return `Missing Required Field: ${requiredField}`;
      } else {
        return null;
      }
    }
  ).filter(item => item !== null);

}

module.exports = validateHeaderRow;