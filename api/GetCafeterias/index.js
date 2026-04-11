console.log("ENV:", process.env.COSMOS_CONNECTION_STRING);
const { containers } = require("../db");

module.exports = async function (context, req) {
  try {
    const { resources: cafeterias } = await containers.cafeterias.items
      .query("SELECT * FROM c")
      .fetchAll();

    context.res = {
      status: 200,
      body: { cafeterias },
    };
  } catch (error) {
    context.res = {
      status: 500,
      body: { error: error.message },
    };
  }
};
