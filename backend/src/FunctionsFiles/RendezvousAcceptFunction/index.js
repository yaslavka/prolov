const {
  getUsers,
  updateMessageUserNotify,
  getNewMessages,
  getRendezvous,
  getRendezvousHistory,
} = require("../RedisInfo");
const { decode } = require("jsonwebtoken");
const { RendezvousModel } = require("../../Models/RendezvousModel");
const {
  RendezvousHistoryModel,
} = require("../../Models/RendezvousHistoryModel");
const { FriendsTable } = require("../../Models/FriendsModel");
const { ChatRoomUsers } = require("../../Models/ChatRoomUsers");
const { Op } = require("sequelize");
const { MessagesUsers } = require("../../Models/MessagesUsers");
const {
  FilterRendezvousHistoryFunction,
} = require("../FilterRendezvousHistoryFunction");

async function RendezvousAcceptFunction(req) {
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
        const { id, recipientId } = req;
        const historys = allRendezvousHistory.find((i) => i.id === id);
        const rendezvous = await RendezvousModel.findOne({
          where: { id: historys.proposalId, status: true },
        });
        const recipient = {
          ...alUsers.find((us) => us.id === recipientId),
        };
        const oldendezvousHistoryFromUser =
          await FilterRendezvousHistoryFunction(userAuth, alUsers);
        const oldendezvousHistoryFromRecipient =
          await FilterRendezvousHistoryFunction(recipient, alUsers);
        const rendezvousHistoryFromUser = [
          ...oldendezvousHistoryFromUser.map((rdv) => {
            if (rdv.id === id) {
              return {
                ...rdv,
                status: true,
              };
            }
            return rdv;
          }),
        ];
        const rendezvousHistoryFromRecipient = [
          ...oldendezvousHistoryFromRecipient.map((rdv) => {
            if (rdv.id === id) {
              return {
                ...rdv,
                status: true,
              };
            }
            return rdv;
          }),
        ];
        if (!rendezvous) {
          message = {
            message: "Пока вы думали отклик был отменен пользователем",
          };
          return { message };
        } else {
          const history = await RendezvousHistoryModel.findOne({
            where: { proposalId: rendezvous.id },
          });
          const friendsSearch = await FriendsTable.findOne({
            where: {
              [Op.or]: [
                {
                  userId: userAuth.id,
                  recipientId: history.userId,
                },
                {
                  userId: history.userId,
                  recipientId: userAuth.id,
                },
              ],
            },
          });
          if (!friendsSearch) {
            await FriendsTable.create({
              status: true,
              userId: userAuth.id,
              recipientId: history.userId,
            });
          }
          await history.update({ status: true });
          let chatId = await ChatRoomUsers.findOne({
            where: {
              [Op.or]: [
                {
                  userId: userAuth.id,
                  recipientId: history.userId,
                },
                {
                  userId: history.userId,
                  recipientId: userAuth.id,
                },
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
          const friends = {
            status: true,
            userId: userAuth.id,
            recipientId: history.userId,
          };
          let updateUsers;
          if (!friendsSearch) {
            updateUsers = alUsers.map((u) => {
              if (u.id === userAuth.id) {
                return {
                  ...u,
                  friends: [...u.friends, friends],
                };
              }
              if (u.id === history.userId) {
                return {
                  ...u,
                  friends: [...u.friends, friends],
                };
              }
              return u;
            });
          } else {
            updateUsers = alUsers;
          }
          const user = {
            ...updateUsers.find((u) => u.id === userAuth.id),
          };
          const userRecipient = {
            ...updateUsers.find((u) => u.id === history.userId),
          };
          const users = [
            ...updateUsers.filter((u) => u.id !== userAuth.id),
          ].reverse();
          const usersAll = [
            ...updateUsers.filter((u) => u.id !== history.userId),
          ].reverse();
          const newMessageObjectRecipient = {
            ...chatId.dataValues,
            message: "acceptRendezvous",
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
            user: user,
          };
          const newMessageObjectUser = {
            ...chatId.dataValues,
            message: "acceptRendezvous",
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
            user: userRecipient,
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
            user,
            userRecipient,
            newMessageNotify,
            newChatUser,
            newChatRecipient,
            users,
            usersAll,
            rendezvousHistoryFromUser,
            rendezvousHistoryFromRecipient,
          };
        }
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
  RendezvousAcceptFunction,
};
