const fs = require('fs');
const Promise = require('bluebird');

function getReadStream(filename) {
  const d = Promise.defer();

  const rs = fs.createReadStream(filename);

  rs.on('error', function (error) {
    d.reject(error);
  });

  rs.on('readable', function () {
    d.resolve(rs);
  });

  return d.promise;
}

module.exports = getReadStream;