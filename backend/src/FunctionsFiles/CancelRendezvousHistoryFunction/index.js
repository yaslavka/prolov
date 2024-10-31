const {
  getUsers,
  updateMessageUserNotify,
  getNewMessages,
} = require("../RedisInfo");
const { decode } = require("jsonwebtoken");
const {
  FilterRendezvousHistoryFunction,
} = require("../FilterRendezvousHistoryFunction");
const {
  RendezvousHistoryModel,
} = require("../../Models/RendezvousHistoryModel");
const { ChatRoomUsers } = require("../../Models/ChatRoomUsers");
const { Op } = require("sequelize");
const { MessagesUsers } = require("../../Models/MessagesUsers");

async function CancelRendezvousHistoryFunction(req) {
  let message;
  try {
    const alUsers = await getUsers();
    const allMessagesNotify = await getNewMessages();
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
        const recipientUser = alUsers.find((us) => us.id === recipientId);
        const rendezvousHistory = await FilterRendezvousHistoryFunction(
          recipientUser,
          alUsers,
        );
        const historyData = await RendezvousHistoryModel.findOne({
          where: { id: id },
        });
        const usersId = JSON.parse(historyData.usersId);
        usersId.push(userAuth.id);
        usersId.push(recipientUser.id);
        await historyData.update({
          usersId: usersId,
          cancel: true,
        });
        let chatId = await ChatRoomUsers.findOne({
          where: {
            [Op.or]: [
              { userId: userAuth.id, recipientId: recipientUser.id },
              { userId: recipientUser.id, recipientId: userAuth.id },
            ],
          },
        });
        if (!chatId) {
          chatId = await ChatRoomUsers.create({
            room: `room-1${Math.random() * 1000000000000000 + 1}`,
            userId: userAuth.id,
            recipientId: recipientUser.id,
          });
        }

        const newMessageCreate = await MessagesUsers.create({
          message: "cancelRendezvous",
          type: "TEXT",
          userId: userAuth.id,
          recipientId: recipientUser.id,
          chatRoomId: chatId.id,
        });
        const newNotify = {
          userId: userAuth.id,
          recipientId: recipientUser.id,
          chatRoomId: chatId.id,
        };
        const newMessageNotify = [...allMessagesNotify, newNotify];
        await updateMessageUserNotify(newMessageNotify);
        const newMessageObjectRecipient = {
          ...chatId.dataValues,
          message: "cancelRendezvous",
          shared: [],
          mediaFile: null,
          userId: userAuth.id,
          recipientId: recipientUser.id,
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
          recipientId: recipientUser.id,
          type: "TEXT",
          status: false,
          friends: true,
          friendsS: false,
          chatRoomId: chatId.id,
          createdAt: newMessageCreate.createdAt,
          user: recipientUser,
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
        const updateNewArrRendezvousHistory = [
          ...rendezvousHistory.map((rdv) => {
            if (rdv.id === id) {
              return {
                ...rdv,
                usersId: JSON.stringify(usersId),
                cancel: true,
              };
            }
            return rdv;
          }),
        ];
        return {
          updateNewArrRendezvousHistory,
          newChatUser,
          newChatRecipient,
          userAuth,
          recipientUser,
          newMessageNotify,
        };
      }
    }
  } catch (error) {
    message = error;
    return {
      message,
    };
  }
}
module.exports = {
  CancelRendezvousHistoryFunction,
};
