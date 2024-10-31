const {
  getUsers,
  getNewMessages,
  getRendezvousHistory,
  updateMessageUserNotify,
} = require("../RedisInfo");
const { decode } = require("jsonwebtoken");
const {
  RendezvousHistoryModel,
} = require("../../Models/RendezvousHistoryModel");
const { ChatRoomUsers } = require("../../Models/ChatRoomUsers");
const { Op } = require("sequelize");
const { MessagesUsers } = require("../../Models/MessagesUsers");

async function RendezvousCancelFunction(req) {
  let message;
  try {
    const alUsers = await getUsers();
    const allMessagesNotify = await getNewMessages();
    const allRendezvousHistory = await getRendezvousHistory();
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
        const { id } = req;
        const history = await RendezvousHistoryModel.findOne({
          where: { id: id },
        });
        await history.update({ cancel: true });
        let chatId = await ChatRoomUsers.findOne({
          where: {
            [Op.or]: [
              { userId: userAuth.id, recipientId: history.userId },
              { userId: history.userId, recipientId: userAuth.id },
            ],
          },
        });
        if (!chatId) {
          chatId = await ChatRoomUsers.create({
            room: `room-1${Math.random() * 1000000000000000 + 1}`,
            userId: userAuth.id,
            recipientId: history.userId,
          });
        }
        const newMessageCreate = await MessagesUsers.create({
          message: "acceptRendezvous",
          type: "TEXT",
          friends: true,
          userId: userAuth.id,
          recipientId: history.userId,
          chatRoomId: chatId.id,
        });
        const newNotify = {
          userId: userAuth.id,
          recipientId: history.userId,
          chatRoomId: chatId.id,
        };
        const newMessageNotify = [...allMessagesNotify, newNotify];
        await updateMessageUserNotify(newMessageNotify);
        const recipient = alUsers.find((rec) => rec.id === history.userId);
        const oldRendezvousHistory = allRendezvousHistory.find(
          (rdv) => rdv.id === id,
        );
        const updateOldRendezvousHistory = {
          ...oldRendezvousHistory,
          cancel: true,
        };
        const newArrRendezvousHistory = allRendezvousHistory.filter(
          (rdv) => rdv.id !== id,
        );
        const updateNewArrRendezvousHistory = [
          ...newArrRendezvousHistory,
          updateOldRendezvousHistory,
        ];
        const historyFromUser = updateNewArrRendezvousHistory.filter(
          (h) => h.userId === userAuth.id || h.recipientId === userAuth.id,
        );
        const historyFromRecipient = updateNewArrRendezvousHistory.filter(
          (h) => h.userId === recipient.id || h.recipientId === recipient.id,
        );
        const newMessageObjectRecipient = {
          ...chatId.dataValues,
          message: "cancelRendezvous",
          shared: [],
          mediaFile: null,
          userId: userAuth.id,
          recipientId: history.userId,
          type: "TEXT",
          status: false,
          friends: true,
          friendsS: false,
          chatRoomId: chatId.id,
          createdAt: newMessageCreate.createdAt,
          user: userAuth,
        };
        const newMessageObjectUser = {
          ...chatId.dataValues,
          message: "cancelRendezvous",
          shared: [],
          mediaFile: null,
          userId: userAuth.id,
          recipientId: history.userId,
          type: "TEXT",
          status: false,
          friends: true,
          friendsS: false,
          chatRoomId: chatId.id,
          createdAt: newMessageCreate.createdAt,
          user: recipient,
        };
        const newChatRecipient = {
          ...newMessageObjectRecipient,
          messages: {
            id: newMessageCreate.id,
            ...newMessageObjectRecipient,
          },
        };
        const newChatUser = {
          ...newMessageObjectUser,
          messages: { id: newMessageCreate.id, ...newMessageObjectUser },
        };
        return {
          historyFromUser,
          historyFromRecipient,
          newChatRecipient,
          newChatUser,
          newMessageNotify,
          userAuth,
          recipient,
        };
      }
    }
  } catch (error) {
    message = error;
    return { message };
  }
}
module.exports = {
  RendezvousCancelFunction,
};
