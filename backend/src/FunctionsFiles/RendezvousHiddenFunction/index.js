const { getUsers, getRendezvous } = require("../RedisInfo");
const { decode } = require("jsonwebtoken");
const { RendezvousModel } = require("../../Models/RendezvousModel");
const { FilterRendezvousFunction } = require("../FilterRendezvousFunction");

async function RendezvousHiddenFunction(req) {
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
        const { id } = req;
        id.map(async (item) => {
          const rendezvous = await RendezvousModel.findOne({
            where: { id: item },
          });
          const usersId = JSON.parse(rendezvous.usersId);
          usersId.push(userAuth.id);
          await rendezvous.update({ usersId: usersId });
        });
        const result = rendezvousOld.map((item) => {
          if (id.includes(item.id)) {
            const usersId = JSON.parse(item.usersId);
            if (!usersId.includes(userAuth.id)) {
              usersId.push(userAuth.id);
            }
            return { ...item, usersId: JSON.stringify(usersId) };
          }
          return item;
        });
        const info = await FilterRendezvousFunction(result, userAuth);
        const rendezvous = info.filter((i) => !id.includes(i.id));
        return { rendezvous, userAuth };
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
  RendezvousHiddenFunction,
};
