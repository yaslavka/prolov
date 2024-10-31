const {
  getUsers,
  getNewFriendsNotify,
  updateFriendsUserNotify,
} = require("../RedisInfo");
const { decode } = require("jsonwebtoken");
const { FriendsTable } = require("../../Models/FriendsModel");
const { Op } = require("sequelize");

async function CancelFriendsFunction(req) {
  let message;
  try {
    const alUsers = await getUsers();
    const allFriendsNotify = await getNewFriendsNotify();
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
        const matchingUsers = alUsers.filter((users) =>
          recipientId.includes(users.id),
        );
        const result = await Promise.all(
          matchingUsers.map(async (recipient) => {
            await FriendsTable.destroy({
              where: {
                [Op.or]: [
                  {
                    userId: recipient.id,
                    recipientId: userAuth.id,
                  },
                  {
                    userId: userAuth.id,
                    recipientId: recipient.id,
                  },
                ],
              },
            });
            for (let i = 0; i < allFriendsNotify.length; i++) {
              if (
                (allFriendsNotify[i].userId === userAuth.id &&
                  allFriendsNotify[i].recipientId === recipient.id) ||
                (allFriendsNotify[i].userId === recipient.id &&
                  allFriendsNotify[i].recipientId === userAuth.id)
              ) {
                allFriendsNotify.splice(i, 1);
                break;
              }
            }
            await updateFriendsUserNotify(allFriendsNotify);
            const user = {
              ...userAuth,
              friends: userAuth.friends.filter(
                (f) =>
                  !(
                    f.userId === userAuth.id && f.recipientId === recipient.id
                  ) &&
                  !(f.userId === recipient.id && f.recipientId === userAuth.id), // Одновременное совпадение обоих полей
              ),
            };

            // Обновление друзей у получателя (recipient)
            const userRecipient = {
              ...recipient,
              friends: recipient.friends.filter(
                (f) =>
                  !(
                    f.userId === userAuth.id && f.recipientId === recipient.id
                  ) &&
                  !(f.userId === recipient.id && f.recipientId === userAuth.id), // Одновременное совпадение обоих полей
              ),
            };
            return { user, userRecipient, allFriendsNotify };
          }),
        );
        const finalResult = result.reduce(
          (acc, current) => ({
            ...acc,
            ...current,
          }),
          {},
        );
        return { finalResult };
      }
    }
  } catch (error) {
    message = error;
    console.log(error);
    return { message };
  }
}
module.exports = {
  CancelFriendsFunction,
};
