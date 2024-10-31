const {
  getUsers,
  getAllChatsUsers,
  getMessagesUsers,
} = require("../RedisInfo");
const { decode } = require("jsonwebtoken");
const { ProcessUserChatFunction } = require("../ProcessDeleteChatFunction");

const addNewIdToSharedRecursive = (message, currentId) => {
  const updatedMessage = {
    ...message,
    newId: currentId.id++,
  };
  if (updatedMessage.shared && updatedMessage.shared.length > 0) {
    updatedMessage.shared = updatedMessage.shared.map((sharedMessage) =>
      addNewIdToSharedRecursive(sharedMessage, currentId),
    );
  }
  return updatedMessage;
};

async function AllMessagesUserFunction(req) {
  let message;
  try {
    const alUsers = await getUsers();
    const alUsersChat = await getAllChatsUsers();
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
        const messageForUser = await ProcessUserChatFunction(
          alUsersChat,
          userAuth,
          alUsers,
        );
        return { messageForUser, userAuth };
      }
    }
  } catch (error) {
    message = error;
    console.log(error);
    return { message };
  }
}
module.exports = {
  AllMessagesUserFunction,
};
