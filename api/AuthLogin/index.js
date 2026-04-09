const { containers } = require("../db");

module.exports = async function (context, req) {
  const { email, password } = req.body || {};

  if (!email || !password) {
    context.res = {
      status: 400,
      body: { error: "Email and password are required" },
    };
    return;
  }

  try {
    const { resources: users } = await containers.users.items
      .query({
        query: "SELECT * FROM c WHERE c.email = @email",
        parameters: [{ name: "@email", value: email }],
      })
      .fetchAll();

    const user = users[0];

    if (!user || user.password !== password) {
      // In a real app, use bcrypt to compare hashed passwords
      context.res = {
        status: 401,
        body: { error: "Invalid email or password" },
      };
      return;
    }

    // Remove password before sending user data back
    const { password: _, ...userWithoutPassword } = user;

    context.res = {
      status: 200,
      body: { user: userWithoutPassword },
    };
  } catch (error) {
    context.res = {
      status: 500,
      body: { error: error.message },
    };
  }
};
