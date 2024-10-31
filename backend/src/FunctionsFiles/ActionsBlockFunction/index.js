const { getUsers } = require("../RedisInfo");
const { decode } = require("jsonwebtoken");
const { BlackListUsers } = require("../../Models/BlackListUsers");

async function ActionsBlockFunction(req) {
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
        const { recipientId, chatId } = req;
        const oldRecipientInfo = {
          ...alUsers.find((us) => us.id === recipientId),
        };
        await BlackListUsers.create({
          userId: userAuth.id,
          recipientId: oldRecipientInfo.id,
          chatRoomId: chatId,
        });

        const user = {
          ...userAuth,
          blackList: [
            ...userAuth.blackList,
            {
              userId: userAuth.id,
              recipientId: oldRecipientInfo.id,
              chatRoomId: chatId,
            },
          ],
        };
        const userRecipient = {
          ...oldRecipientInfo,
          blackList: [
            ...oldRecipientInfo.blackList,
            {
              userId: userAuth.id,
              recipientId: oldRecipientInfo.id,
              chatRoomId: chatId,
            },
          ],
        };

        return { user, userRecipient };
      }
    }
  } catch (error) {
    message = error;
    console.log(error);
    return {
      message,
    };
  }
}

module.exports = {
  ActionsBlockFunction,
};
