const { getUsers } = require("../RedisInfo");
const { decode } = require("jsonwebtoken");
const { MessagesUsers } = require("../../Models/MessagesUsers");
const { ProcessChatDataFunction } = require("../ProcessChatDataFunction");

async function DeleteMessageFunction(req) {
  let messageerror;
  try {
    const alUsers = await getUsers();
    const { authorization } = req;
    if (!authorization) {
      messageerror = { message: "Вы не авторизованы" };
      return { messageerror };
    } else {
      const { email } = decode(authorization);
      const userAuth = { ...alUsers.find((us) => us.email === email) };
      if (!userAuth) {
        messageerror = { message: "Такой пользователь не найден" };
        return { messageerror };
      } else {
        const dataUsers = {
          userId: userAuth.id,
          recipientId: req.isDelete[0].recipientId,
        };
        req.isDelete.map(async (message) => {
          await MessagesUsers.destroy({
            where: { id: message.id },
          });
        });
        const { resultUser, resultRecipient } = await ProcessChatDataFunction(
          dataUsers,
          alUsers,
        );
        return { resultUser, resultRecipient, dataUsers };
      }
    }
  } catch (error) {
    messageerror = error;
    return { messageerror };
  }
}
module.exports = {
  DeleteMessageFunction,
};
