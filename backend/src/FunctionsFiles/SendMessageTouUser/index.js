const {
  getUsers,
  getNewMessages,
  updateMessageUserNotify,
} = require("../RedisInfo");
const { decode } = require("jsonwebtoken");
const { ChatRoomUsers } = require("../../Models/ChatRoomUsers");
const { CreateNewMessageFunction } = require("../CreateNewMessageFunction");
const { SveMedia } = require("../SveMedia");
async function SendMessageTouUser(req) {
  let messageError;
  try {
    const alUsers = await getUsers();
    const messageNotfi = await getNewMessages();
    const { authorization } = req;
    if (!authorization) {
      messageError = { message: "Вы не авторизованы" };
      return { messageError };
    } else {
      const { email } = decode(authorization);
      const userAuth = { ...alUsers.find((us) => us.email === email) };
      let currentId = { id: -10000 };
      if (!userAuth) {
        messageError = { message: "Такой пользователь не найден" };
        return { messageError };
      } else {
        const { id, type, recipientId, message, mediaFile, shared, messageId } =
          req;
        const userRecipient = {
          ...alUsers.find((us) => us.id === recipientId),
        };
        let chatSearch = await ChatRoomUsers.findOne({ where: { id: id } });
        if (!chatSearch) {
          chatSearch = await ChatRoomUsers.create({
            room: `room-1${Math.random() * 1000000000000000 + 1}`,
            userId: userAuth.id,
            recipientId: userRecipient.id,
          });
        }
        let newMessageContent;
        let fileNameImage = mediaFile;
        if (type === "TEXT") {
          newMessageContent = message;
        } else if (type === "VOICE") {
          const fileName = `audio_${Date.now()}.mp3`;
          const audioPath = `./files/audios/${fileName}`;
          await SveMedia(audioPath, message); // Сохранение голосового сообщения
          newMessageContent = fileName; // Используем имя файла в качестве сообщения
        } else if (type === "MEDIA") {
          fileNameImage = `img_${Date.now()}.gif`;
          const imgPath = `./files/photos/${fileNameImage}`;
          await SveMedia(imgPath, mediaFile);
          newMessageContent = message;
        }
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
        const sharedMessages = [
          ...shared.map((messageShared) =>
            addNewIdToSharedRecursive(messageShared, currentId),
          ),
        ];
        const newData = {
          message: newMessageContent,
          mediaFile: fileNameImage,
          type: type,
          chatRoomId: chatSearch.id,
          messageId: messageId,
          userId: userAuth.id,
          recipientId: userRecipient.id,
          shared: shared.length > 0 ? sharedMessages : shared,
        };
        const { messageCreate } = await CreateNewMessageFunction(newData);
        const createMessageObject = (user, messageData) => ({
          id: chatSearch.id,
          ...messageData,
          user: user,
          createdAt: messageCreate.createdAt,
          messages: {
            id: messageCreate.id,
            ...messageData,
            user: user,
            newId: currentId.id++,
            createdAt: messageCreate.createdAt,
          },
        });
        const messageForUser = createMessageObject(userRecipient, newData);
        const messageForRecipient = createMessageObject(userAuth, newData);
        const newNotify = [
          ...messageNotfi,
          {
            id: messageCreate.id,
            chatRoomId: chatSearch.id,
            recipientId: userRecipient.id,
          },
        ];
        await updateMessageUserNotify(newNotify);
        return { messageForUser, messageForRecipient, newNotify };
      }
    }
  } catch (error) {
    messageError = error;
    console.log(error);
    return { messageError };
  }
}
module.exports = {
  SendMessageTouUser,
};
