function executeSql(importSql, pgClient){
  return pgClient()
    .then(client => {
      return client.query(importSql);
    })
}

module.exports = executeSql;