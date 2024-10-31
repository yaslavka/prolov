const { getUsers, getRendezvousHistory } = require("../RedisInfo");
const { decode } = require("jsonwebtoken");
const {
  RendezvousHistoryModel,
} = require("../../Models/RendezvousHistoryModel");

async function RendezvousHistoryDeleteFunction(req) {
  let message;
  try {
    const alUsers = await getUsers();
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
        await Promise.all(
          id.map(async (item) => {
            const rendezvous = await RendezvousHistoryModel.findOne({
              where: { id: item },
            });
            const usersId = JSON.parse(rendezvous.usersId);
            if (!usersId.includes(userAuth.id)) {
              usersId.push(userAuth.id);
              await rendezvous.update({ usersId: usersId });
            }
          }),
        );
        const resultNew = allRendezvousHistory.map((item) => {
          if (id.includes(item.id)) {
            const usersId = JSON.parse(item.usersId);
            if (!usersId.includes(userAuth.id)) {
              usersId.push(userAuth.id);
            }
            return { ...item, usersId: JSON.stringify(usersId) };
          }
          return item;
        });
        const result = resultNew.filter((h) => !id.includes(h.id));
        return { result, userAuth };
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
  RendezvousHistoryDeleteFunction,
};
