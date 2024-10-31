const { ChatRoomUsers } = require("../../Models/ChatRoomUsers");
const { Op } = require("sequelize");
const { MessagesUsers } = require("../../Models/MessagesUsers");

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

async function ProcessChatDataFunction(dataUsers, resultUsers) {
  const [chatUsers, chatRecipients] = await Promise.all([
    ChatRoomUsers.findAll({
      where: {
        [Op.or]: [
          { userId: dataUsers.userId },
          { recipientId: dataUsers.userId },
        ],
      },
    }),
    ChatRoomUsers.findAll({
      where: {
        [Op.or]: [
          { userId: dataUsers.recipientId },
          { recipientId: dataUsers.recipientId },
        ],
      },
    }),
  ]);
  let initialId = { id: 1 };
  const formatResults = async (item, id) => {
    const allUser = resultUsers.filter((i) => i.id !== id);
    return await Promise.all(
      item.map(async (chat) => {
        const userId = chat.userId === id ? chat.recipientId : chat.userId;
        const user = { ...resultUsers.find((u) => u.id === userId) };
        const messagesSearch = await MessagesUsers.findAll({
          where: { chatRoomId: chat.id },
        });
        const alllMessages = [...messagesSearch];
        const message = alllMessages
          .filter((m) => m.dataValues.chatRoomId === chat.id)
          .sort(
            (a, b) =>
              new Date(b.dataValues.createdAt) -
              new Date(a.dataValues.createdAt),
          )[0];
        const messages = await Promise.all(
          alllMessages.map((mes) => {
            const userM = allUser.find(
              (u) =>
                u.id === mes.dataValues.userId ||
                u.id === mes.dataValues.recipientId,
            );
            const shared = [...JSON.parse(mes.dataValues.shared)];
            return {
              ...mes.dataValues,
              user: userM,
              newId: initialId.id++,
              shared: [
                ...shared.map((messageShared) =>
                  addNewIdToSharedRecursive(messageShared, initialId),
                ),
              ],
            };
          }),
        );
        return {
          message: message ? message.message : "",
          shared: message ? message.shared : [],
          mediaFile: message ? message.mediaFile : "",
          type: message ? message.type : "",
          status: message ? message.status : true,
          friends: message ? message.friends : false,
          friendsS: message ? message.friendsS : false,
          chatRoomId: chat.id,
          createdAt: message ? message.createdAt : "",
          updatedAt: message ? message.updatedAt : "",
          id: chat.id,
          room: chat.room,
          user: user,
          userId: chat.userId,
          recipientId: chat.recipientId,
          messages: messages,
        };
      }),
    );
  };

  const resultUser = await formatResults(chatUsers, dataUsers.userId);
  const resultRecipient = await formatResults(
    chatRecipients,
    dataUsers.recipientId,
  );
  return { resultUser, resultRecipient };
}
module.exports = {
  ProcessChatDataFunction,
};
