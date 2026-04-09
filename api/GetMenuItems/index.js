const { containers } = require("../db");

module.exports = async function (context, req) {
  const { cafeId } = req.query || {};

  if (!cafeId) {
    context.res = {
      status: 400,
      body: { error: "cafeId is required" },
    };
    return;
  }

  try {
    const { resources: items } = await containers.menuItems.items
      .query({
        query: "SELECT * FROM c WHERE c.cafeId = @cafeId",
        parameters: [{ name: "@cafeId", value: cafeId }],
      })
      .fetchAll();

    context.res = {
      status: 200,
      body: { items },
    };
  } catch (error) {
    context.res = {
      status: 500,
      body: { error: error.message },
    };
  }
};
