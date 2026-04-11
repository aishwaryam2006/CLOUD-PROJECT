const { CosmosClient } = require("@azure/cosmos");

const endpoint = process.env.COSMOS_ENDPOINT;
const key = process.env.COSMOS_KEY;

if (!endpoint || !key) {
  throw new Error("COSMOS_ENDPOINT or COSMOS_KEY missing");
}

const client = new CosmosClient({ endpoint, key });

const databaseId = "VirtualQueueDB";
const database = client.database(databaseId);

const containers = {
  users: database.container("users"),
  cafeterias: database.container("cafeterias"),
  menuItems: database.container("menuItems"),
  orders: database.container("orders"),
  queues: database.container("queues"),
};

module.exports = { client, database, containers };
