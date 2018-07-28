const fs = require('fs');
const Promise = require('bluebird');

function getReadStream(filename, eventListeners) {
  const d = Promise.defer();

  const rs = fs.createReadStream(filename);

  rs.on('error', function (error) {
    d.reject(error);
  });

  rs.on('readable', function () {
    d.resolve(rs);
  });

  eventListeners || [].map(
    listener => {
      rs.on(listener.event, listener.handler)
    }
  )

  return d.promise;
}

module.exports = getReadStream;