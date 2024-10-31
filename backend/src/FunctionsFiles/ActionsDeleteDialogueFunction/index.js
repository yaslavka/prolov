const { getUsers, getAllChatsUsers } = require("../RedisInfo");
const { decode } = require("jsonwebtoken");
const { ProcessUserChatFunction } = require("../ProcessDeleteChatFunction");
const { ChatRoomUsers } = require("../../Models/ChatRoomUsers");
const { MessagesUsers } = require("../../Models/MessagesUsers");
const { BlackListUsers } = require("../../Models/BlackListUsers");

async function ActionsDeleteDialogueFunction(req) {
  let message;
  try {
    const alUsers = await getUsers();
    const allChatsUser = await getAllChatsUsers();
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
        const { id, recipientId } = req;
        const chat = await ChatRoomUsers.findOne({ where: { id: id } });
        await MessagesUsers.destroy({ where: { chatRoomId: chat.id } });
        const messages = await MessagesUsers.findAll({
          where: { chatRoomId: chat.id },
        });
        if (messages.length <= 0) {
          await chat.destroy();
        }
        const userRecipient = alUsers.find((us) => us.id === recipientId);
        const newArrChatUser = [...allChatsUser.filter((c) => c.id !== id)];
        const resultUser = await ProcessUserChatFunction(
          newArrChatUser,
          userAuth,
          alUsers,
        );
        const resultRecipient = await ProcessUserChatFunction(
          newArrChatUser,
          userRecipient,
          alUsers,
        );
        return { resultUser, resultRecipient, userAuth, userRecipient };
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
  ActionsDeleteDialogueFunction,
};
