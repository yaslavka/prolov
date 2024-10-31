const { getMessagesUsers } = require("../RedisInfo");

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

async function ProcessUserChatFunction(allChats, user, alUsers) {
  const alllMessages = await getMessagesUsers();
  const allChatUser = [
    ...allChats.filter(
      (chat) => chat.userId === user.id || chat.recipientId === user.id,
    ),
  ];
  let initialId = { id: 1 };
  const users = [...alUsers.filter((u) => u.id !== user.id)];
  return await Promise.all(
    allChatUser.map((chat) => {
      const message = alllMessages
        .filter((m) => m.chatRoomId === chat.id)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
      const allMessages = [
        ...alllMessages
          .filter((m) => m.chatRoomId === chat.id)
          .map((mess) => {
            const userM = users.find(
              (u) => u.id === mess.userId || u.id === mess.recipientId,
            );
            const shared = [...JSON.parse(mess.shared)];
            return {
              ...mess,
              user: userM,
              newId: initialId.id++,
              shared: [
                ...shared.map((messageShared) =>
                  addNewIdToSharedRecursive(messageShared, initialId),
                ),
              ],
            };
          }),
      ];
      const userC = {
        ...users.find((u) => u.id === chat.userId || u.id === chat.recipientId),
      };
      return {
        message: message ? message.message : "",
        shared: message ? message.shared : [],
        mediaFile: message ? message.mediaFile : "",
        type: message ? message.type : "",
        status: message ? message.status : true,
        friends: message ? message.friends : false,
        friendsS: message ? message.friendsS : false,
        chatRoomId: chat.id,
        createdAt: message ? message.createdAt : chat.createdAt,
        updatedAt: message ? message.updatedAt : chat.updatedAt,
        id: chat.id,
        room: chat.room,
        user: userC,
        userId: chat.userId,
        recipientId: chat.recipientId,
        messages: allMessages,
      };
    }),
  );
}
module.exports = {
  ProcessUserChatFunction,
};
