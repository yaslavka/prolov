const { getUsers, getGeneralChatMessages } = require("../RedisInfo");
const { decode } = require("jsonwebtoken");

async function GeneralChatFunction(req) {
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
        const getGeneralCatMessage = await getGeneralChatMessages();
        return { getGeneralCatMessage };
      }
    }
  } catch (error) {
    message = error;
    console.log(error);
    return { message };
  }
}

module.exports = {
  GeneralChatFunction,
};
