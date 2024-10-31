const {
  getUsers,
  getNewMessages,
  getNewFriendsNotify,
  updateFriendsUserNotify,
  updateMessageUserNotify,
} = require("../RedisInfo");
const { decode } = require("jsonwebtoken");
const { FriendsTable } = require("../../Models/FriendsModel");
const { MessagesUsers } = require("../../Models/MessagesUsers");
const { ChatRoomUsers } = require("../../Models/ChatRoomUsers");
const { Op } = require("sequelize");
const { UserTable } = require("../../Models/UserModels");
const { InsertUserInOrderFunction } = require("../InsertUserInOrderFunction");

async function GiveASubscriptionFunction(req) {
  let message;
  try {
    const allUsers = await getUsers();
    const allMessagesNotify = await getNewMessages();
    const allFriendsNotify = await getNewFriendsNotify();
    const { authorization } = req;
    if (!authorization) {
      message = { message: "Вы не авторизованы" };
      return { message };
    } else {
      const { email } = decode(authorization);
      const userAuth = { ...allUsers.find((us) => us.email === email) };
      if (!userAuth) {
        message = { message: "Такой пользователь не найден" };
        return { message };
      } else {
        const { recipientId, price, count } = req;
        const recipientUser = allUsers.find((us) => us.id === recipientId);
        const newArrAllUsers = [
          ...allUsers.filter(
            (us) => us.id !== userAuth.id && us.id !== recipientUser.id,
          ),
        ];
        await UserTable.update(
          { base: true },
          { where: { id: recipientUser.id } },
        );
        let hidden = [];
        let friendsCreate = await FriendsTable.findOne({
          where: {
            [Op.or]: [
              { userId: userAuth.id, recipientId: recipientUser.id },
              { userId: recipientUser.id, recipientId: userAuth.id },
            ],
          },
        });
        if (!friendsCreate) {
          friendsCreate = await FriendsTable.create({
            status: true,
            count: count,
            price: price,
            userId: userAuth.id,
            recipientId: recipientUser.id,
          });
        } else {
          let hiddenId = JSON.parse(friendsCreate.hidden);
          if (hiddenId.includes(userAuth.id)) {
            hiddenId = hiddenId.filter((id) => id !== userAuth.id);
            hidden = hiddenId.filter((id) => id !== userAuth.id);
            await friendsCreate.update({
              hidden: hiddenId,
              status: true,
              count: count,
              price: price,
              userId: userAuth.id,
              recipientId: recipientUser.id,
            });
          } else {
            hidden = hiddenId.filter((id) => id !== userAuth.id);
            await friendsCreate.update({
              hidden: hiddenId,
              status: true,
              count: count,
              price: price,
              userId: userAuth.id,
              recipientId: recipientUser.id,
            });
          }
        }
        const newFriendsObject = {
          id: friendsCreate.id,
          status: true,
          hidden: JSON.stringify(hidden),
          count: count,
          price: price,
          userId: userAuth.id,
          recipientId: recipientUser.id,
        };
        let chatId = await ChatRoomUsers.findOne({
          where: {
            [Op.or]: [
              { userId: userAuth.id, recipientId: recipientId },
              { userId: recipientId, recipientId: userAuth.id },
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
        const createNewMessage = await MessagesUsers.create({
          message: "giveASubscription",
          type: "TEXT",
          friendsS: true,
          userId: userAuth.id,
          recipientId: recipientUser.id,
          chatRoomId: chatId.id,
        });
        const newNotifyMessage = {
          userId: userAuth.id,
          recipientId: recipientUser.id,
          chatRoomId: chatId.id,
        };
        const newMessageNotify = [...allMessagesNotify, newNotifyMessage];
        await updateMessageUserNotify(newMessageNotify);
        const newFriends = [...allFriendsNotify, newFriendsObject];
        await updateFriendsUserNotify(newFriends);
        const newMessage = {
          ...chatId.dataValues,
          message: "giveASubscription",
          type: "TEXT",
          shared: [],
          mediaFile: null,
          friendsS: true,
          status: false,
          friends: true,
          createdAt: createNewMessage.createdAt,
          userId: userAuth.id,
          recipientId: recipientUser.id,
          chatRoomId: chatId.id,
        };
        const updateRecipient = {
          ...recipientUser,
          friends: [...recipientUser.friends, newFriendsObject],
          base: true,
        };
        const updateUser = {
          ...userAuth,
          friends: [...recipientUser.friends, newFriendsObject],
        };
        const newChatRecipient = {
          ...newMessage,
          user: updateUser,
          messages: {
            id: createNewMessage.id,
            user: updateUser,
            ...newMessage,
          },
        };
        const newChatUser = {
          ...newMessage,
          user: updateRecipient,
          messages: {
            id: createNewMessage.id,
            user: updateRecipient,
            ...newMessage,
          },
        };
        let allUsersFromUser = [...newArrAllUsers];
        allUsersFromUser = await InsertUserInOrderFunction(
          allUsersFromUser,
          updateRecipient,
        );
        let allUsersFromRecipient = [...newArrAllUsers];
        allUsersFromRecipient = await InsertUserInOrderFunction(
          allUsersFromRecipient,
          updateUser,
        );
        let updateArrUser = [...newArrAllUsers];
        updateArrUser = await InsertUserInOrderFunction(
          updateArrUser,
          updateRecipient,
        );
        updateArrUser = await InsertUserInOrderFunction(
          updateArrUser,
          updateUser,
        );
        return {
          updateRecipient,
          updateUser,
          newChatRecipient,
          newChatUser,
          allUsersFromUser,
          allUsersFromRecipient,
          newFriends,
          newMessageNotify,
          newArrAllUsers,
          updateArrUser,
        };
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
  GiveASubscriptionFunction,
};
