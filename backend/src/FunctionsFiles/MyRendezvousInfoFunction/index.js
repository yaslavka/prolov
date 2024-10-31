const { getUsers, getRendezvous } = require("../RedisInfo");
const { decode } = require("jsonwebtoken");

async function MyRendezvousInfoFunction(req) {
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
        const rendezvous = rendezvousOld
          .filter((rdv) => rdv.userId === userAuth.id)
          .reverse();
        const myRendezvous =
          rendezvous.find((rdv) => rdv.userId === userAuth.id) || null;
        return { myRendezvous, userAuth };
      }
    }
  } catch (error) {
    message = error;
    console.log(error);
    return { message };
  }
}
module.exports = {
  MyRendezvousInfoFunction,
};
