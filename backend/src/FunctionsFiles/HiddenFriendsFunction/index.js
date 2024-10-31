const { getUsers } = require("../RedisInfo");
const { decode } = require("jsonwebtoken");
const { FriendsTable } = require("../../Models/FriendsModel");
const { where } = require("sequelize");

async function HiddenFriendsFunction(req) {
  let message;
  try {
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
        const oldFriends = await FriendsTable.findAll({
          where: {
            userId: recipientId.map((i) => i),
            recipientId: userAuth.id,
            status: false,
          },
        });
        await Promise.all(
          oldFriends.map(async (frd) => {
            const hidden = JSON.parse(frd.dataValues.hidden);
            hidden.push(userAuth.id);
            await FriendsTable.update(
              { hidden: hidden },
              { where: { id: frd.dataValues.id } },
            );
          }),
        );
        const newArrFriendsUser = [
          ...userAuth.friends.filter(
            (frd) => !recipientId.includes(frd.userId),
          ),
        ];
        const userFriendsOld = [
          ...userAuth.friends.filter((frd) => recipientId.includes(frd.userId)),
        ];
        const friendsUpdateArr = userFriendsOld.map((frd) => {
          const hidden = JSON.parse(frd.hidden);
          hidden.push(userAuth.id);
          return {
            ...frd,
            hidden: JSON.stringify(hidden),
          };
        });
        const updateFriends = [...newArrFriendsUser, ...friendsUpdateArr];
        const user = { ...userAuth, friends: updateFriends };
        return { user };
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
  HiddenFriendsFunction,
};
