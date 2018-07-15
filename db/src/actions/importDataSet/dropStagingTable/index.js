
function dropStagingTable(workspace){
  const sql = `DROP TABLE IF EXISTS ${workspace.stagingTable}`;

  return workspace.importInfo.pgClient()
    .then(client => {
      return client.query(sql);
    });
}

module.exports = dropStagingTable;