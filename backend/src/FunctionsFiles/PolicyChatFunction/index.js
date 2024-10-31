const { getUsers } = require("../RedisInfo");
const { decode } = require("jsonwebtoken");
const { UserTable } = require("../../Models/UserModels");

async function PolicyChatFunction(req) {
  let message;
  try {
    const alUsers = await getUsers();
    const { authorization } = req;
    if (!authorization) {
      message = { message: "Вы не авторизованы" };
      return { message };
    } else {
      const { email } = decode(authorization);
      const userAuth = { ...alUsers.find((us) => us.email === email) };
      if (!userAuth) {
        message = { message: "Такой пользователь не найден" };
        return { message };
      } else {
        await UserTable.update(
          { policyChat: true },
          { where: { id: userAuth.id } },
        );
        const user = { ...userAuth, policyChat: true };
        return { user };
      }
    }
  } catch (error) {
    message = error;
    console.log(error);
    return { message };
  }
}

module.exports = {
  PolicyChatFunction,
};
