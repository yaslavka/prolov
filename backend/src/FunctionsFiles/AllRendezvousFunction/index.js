const { getUsers, getRendezvous } = require("../RedisInfo");
const { decode } = require("jsonwebtoken");
const { FilterRendezvousFunction } = require("../FilterRendezvousFunction");
const {
  FilterRendezvousHistoryFunction,
} = require("../FilterRendezvousHistoryFunction");

async function AllRendezvousFunction(req) {
  let message;
  try {
    const alUsers = await getUsers();
    const rendezvousOld = await getRendezvous();
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
        const rendezvous = await FilterRendezvousFunction(
          rendezvousOld,
          userAuth,
        );
        const rendezvousHistory = await FilterRendezvousHistoryFunction(
          userAuth,
          alUsers,
        );
        return { rendezvous, rendezvousHistory, userAuth };
      }
    }
  } catch (error) {
    message = error;
    console.log(error);
    return { message };
  }
}
module.exports = {
  AllRendezvousFunction,
};
