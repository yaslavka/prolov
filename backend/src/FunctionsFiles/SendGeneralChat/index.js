const { getUsers } = require("../RedisInfo");
const { decode } = require("jsonwebtoken");
const { MessagesChat } = require("../../Models/MessagesChat");

async function SendGeneralChat(req) {
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
        const newM = await MessagesChat.create({
          message: req.message,
          userId: userAuth.id,
          chatRoomAllId: 1,
        });
        const newMessages = {
          id: newM.id,
          message: req.message,
          userId: userAuth.id,
          chatRoomAllId: 1,
          user: userAuth,
        };
        return { newMessages };
      }
    }
  } catch (error) {
    message = error;
    console.log(error);
    return { message };
  }
}
module.exports = {
  SendGeneralChat,
};
