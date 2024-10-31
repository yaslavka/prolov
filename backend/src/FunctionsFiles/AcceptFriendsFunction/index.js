const {
  getUsers,
  getNewMessages,
  updateMessageUserNotify,
} = require("../RedisInfo");
const { decode } = require("jsonwebtoken");
const { ChatRoomUsers } = require("../../Models/ChatRoomUsers");
const { MessagesUsers } = require("../../Models/MessagesUsers");
const { FriendsTable } = require("../../Models/FriendsModel");
const { Op } = require("sequelize");

async function AcceptFriendsFunction(req) {
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
        const { recipientId } = req;
        const recipient = {
          ...alUsers.find((user) => user.id === recipientId),
        };
        let chatId = await ChatRoomUsers.findOne({
          where: {
            [Op.or]: [
              { userId: userAuth.id, recipientId: recipient.id },
              { userId: recipient.id, recipientId: userAuth.id },
            ],
          },
        });
        if (!chatId) {
          chatId = await ChatRoomUsers.create({
            room: `room-1${Math.random() * 1000000000000000 + 1}`,
            userId: userAuth.id,
            recipientId: recipient.id,
          });
        }
        await FriendsTable.update(
          { status: true },
          {
            where: {
              userId: recipient.id,
              recipientId: userAuth.id,
            },
          },
        );
        const friends = {
          status: true,
          count: null,
          userId: recipient.id,
          recipientId: userAuth.id,
          hidden: "[]",
        };
        const updateUsers = alUsers.map((u) => {
          if (u.id === userAuth.id) {
            return {
              ...u,
              friends: u.friends.map((f) =>
                f.userId === recipient.id && f.recipientId === userAuth.id
                  ? friends
                  : f,
              ),
            };
          }
          if (u.id === recipient.id) {
            return {
              ...u,
              friends: [...u.friends, friends],
            };
          }
          return u;
        });
        const userRecipient = {
          ...updateUsers.find((u) => u.id === recipient.id),
        };
        const usersAll = [...updateUsers.filter((u) => u.id !== recipient.id)];
        const newMessageCreate = await MessagesUsers.create({
          message: "acceptFriend",
          type: "TEXT",
          friends: true,
          userId: userAuth.id,
          recipientId: recipient.id,
          chatRoomId: chatId.id,
        });
        const newNotify = {
          userId: userAuth.id,
          recipientId: recipient.id,
          chatRoomId: chatId.id,
        };
        const newMessageNotify = [...allMessagesNotify, newNotify];
        await updateMessageUserNotify(newMessageNotify);
        const newMessageObjectRecipient = {
          ...chatId.dataValues,
          message: "acceptFriend",
          shared: [],
          mediaFile: null,
          userId: userAuth.id,
          recipientId: recipient.id,
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
          message: "acceptFriend",
          shared: [],
          mediaFile: null,
          userId: userAuth.id,
          recipientId: recipient.id,
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
          userRecipient,
          newMessageNotify,
          newChatUser,
          newChatRecipient,
          usersAll,
          userAuth,
        };
      }
    }
  } catch (error) {
    message = error;
    console.log(error);
    return { message };
  }
}
module.exports = {
  AcceptFriendsFunction,
};
