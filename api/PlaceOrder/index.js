const { containers } = require("../db");

module.exports = async function (context, req) {
  const { cafeId, studentId, items, cafeName, studentName } = req.body || {};

  if (!cafeId || !studentId || !items || !items.length) {
    context.res = {
      status: 400,
      body: { error: "Required fields are missing" },
    };
    return;
  }

  try {
    // 1. Get and update the queue token
    const queueId = `queue_${cafeId}`;
    const { resource: queueDoc } = await containers.queues.item(queueId, cafeId).read();

    if (!queueDoc) {
      context.res = {
        status: 404,
        body: { error: "Queue document not found for this cafeteria" },
      };
      return;
    }

    const newToken = queueDoc.lastToken + 1;
    queueDoc.lastToken = newToken;

    await containers.queues.item(queueId, cafeId).replace(queueDoc);

    // 2. Create the order document
    const orderId = `ord_${Date.now()}`;
    const newOrder = {
      id: orderId,
      cafeId,
      cafeName,
      studentId,
      studentName,
      items,
      total: items.reduce((s, i) => s + i.price * i.qty, 0),
      token: newToken,
      status: "ordered",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toISOString().split('T')[0],
      orderClaimed: false
    };

    const { resource: createdOrder } = await containers.orders.items.create(newOrder);

    context.res = {
      status: 201,
      body: { order: createdOrder },
    };
  } catch (error) {
    context.res = {
      status: 500,
      body: { error: error.message },
    };
  }
};
