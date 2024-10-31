const { getUsers, getAllChatsUsers } = require("../RedisInfo");
const { decode } = require("jsonwebtoken");
const { MessagesUsers } = require("../../Models/MessagesUsers");
const { ProcessUserChatFunction } = require("../ProcessDeleteChatFunction");

async function ActionsClearChatFunction(req) {
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
        const userRecipient = alUsers.find((us) => us.id === recipientId);
        const oldChat = allChatsUser.find((c) => c.id === id);
        await MessagesUsers.destroy({ where: { chatRoomId: id } });
        const chatRecipient = {
          ...oldChat,
          message: "",
          shared: [],
          mediaFile: "",
          type: "",
          status: true,
          friends: false,
          friendsS: false,
          createdAt: "",
          updatedAt: "",
          user: userAuth,
          messages: [],
        };
        const chatUser = {
          ...oldChat,
          message: "",
          shared: [],
          mediaFile: "",
          type: "",
          status: true,
          friends: false,
          friendsS: false,
          createdAt: "",
          updatedAt: "",
          user: userRecipient,
          messages: [],
        };
        const deleteChat = allChatsUser.filter((c) => c.id !== id);
        const result = await ProcessUserChatFunction(
          deleteChat,
          userAuth,
          alUsers,
        );
        const resultR = await ProcessUserChatFunction(
          deleteChat,
          userRecipient,
          alUsers,
        );

        const resultUser = [...result, chatUser];
        const resultRecipient = [...resultR, chatRecipient];
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
  ActionsClearChatFunction,
};
