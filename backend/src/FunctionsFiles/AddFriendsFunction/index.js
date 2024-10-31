const {
  getUsers,
  getNewFriendsNotify,
  updateFriendsUserNotify,
} = require("../RedisInfo");
const { decode } = require("jsonwebtoken");
const { FriendsTable } = require("../../Models/FriendsModel");

async function AddFriendsFunction(req) {
  let message;
  try {
    const oldFFriendsNotify = await getNewFriendsNotify();
    const alUsers = await getUsers();
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
        const recipientOld = { ...alUsers.find((us) => us.id === recipientId) };
        await FriendsTable.create({
          userId: userAuth.id,
          recipientId: recipientOld.id,
        });
        const newFriendsObject = {
          status: false,
          userId: userAuth.id,
          recipientId: recipientOld.id,
          hidden: "[]",
        };

        const newFriends = [...oldFFriendsNotify, newFriendsObject];
        await updateFriendsUserNotify(newFriends);
        const updateUsers = alUsers.map((u) => {
          if (u.id === userAuth.id) {
            return {
              ...u,
              friends: [...u.friends, newFriendsObject],
            };
          }
          if (u.id === recipientOld.id) {
            return {
              ...u,
              friends: [...u.friends, newFriendsObject],
            };
          }
          return u;
        });
        const user = {
          ...updateUsers.find((u) => u.id === userAuth.id),
        };
        const recipient = {
          ...updateUsers.find((u) => u.id === recipientOld.id),
        };
        const users = updateUsers.filter((u) => u.id !== userAuth.id);
        const usersAll = updateUsers.filter((u) => u.id !== recipientOld.id);
        return { user, recipient, newFriends, users, usersAll };
      }
    }
  } catch (error) {
    message = error;
    console.log(error);
    return { message };
  }
}
module.exports = {
  AddFriendsFunction,
};
