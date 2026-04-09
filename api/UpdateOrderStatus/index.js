const { containers } = require("../db");

module.exports = async function (context, req) {
  const { orderId, cafeId, newStatus } = req.body || {};

  if (!orderId || !cafeId || !newStatus) {
    context.res = {
      status: 400,
      body: { error: "orderId, cafeId, and newStatus are required" },
    };
    return;
  }

  try {
    const { resource: orderDoc } = await containers.orders.item(orderId, cafeId).read();

    if (!orderDoc) {
      context.res = {
        status: 404,
        body: { error: "Order not found" },
      };
      return;
    }

    orderDoc.status = newStatus;

    const { resource: updatedOrder } = await containers.orders.item(orderId, cafeId).replace(orderDoc);

    context.res = {
      status: 200,
      body: { order: updatedOrder },
    };
  } catch (error) {
    context.res = {
      status: 500,
      body: { error: error.message },
    };
  }
};
