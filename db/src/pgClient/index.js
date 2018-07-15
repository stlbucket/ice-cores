const Promise = require('bluebird');
const Client = require('pg').Client;

function getClient(){
  const d = Promise.defer();

  const client = new Client({
    connectionString: process.env.DB_CONNECTION_STRING
  });

  client.connect(function (err, client) {
    if (err) d.reject(err);

    d.resolve(client);
  });

  return d.promise;
}

module.exports = getClient;