const { CosmosClient } = require("@azure/cosmos");

const endpoint = process.env.COSMOS_ENDPOINT;
const key = process.env.COSMOS_KEY;
const connectionString = process.env.COSMOS_CONNECTION_STRING;

let client;
if (connectionString) {
  client = new CosmosClient(connectionString);
} else {
  client = new CosmosClient({ endpoint, key });
}

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
