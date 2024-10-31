const { getUsers } = require("../RedisInfo");
const { decode } = require("jsonwebtoken");
const { RendezvousModel } = require("../../Models/RendezvousModel");
const { UserTable } = require("../../Models/UserModels");
const { getRendezvous } = require("../../FunctionsFiles/RedisInfo");

async function RendezvousDeleteFunction(req) {
  let message;
  try {
    const alUsers = await getUsers();
    const rendezvousSearch = await getRendezvous();
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
        const { updatedAt, id } = req;
        const myRendezvous = rendezvousSearch.find(
          (rdv) => rdv.userId === userAuth.id && rdv.id === id,
        );
        const newArrRendezvous = rendezvousSearch.filter(
          (rdv) => rdv.id !== id,
        );
        await RendezvousModel.update(
          { status: false, updatedAt: updatedAt },
          { where: { userId: userAuth.id } },
        );
        await UserTable.update(
          { isRendezvous: true, isRendezvousTime: updatedAt },
          { where: { id: userAuth.id } },
        );
        const updateMyRendezvous = {
          ...myRendezvous,
          status: false,
          updatedAt: updatedAt,
        };
        const rendezvous = [...newArrRendezvous, updateMyRendezvous];
        const user = { ...userAuth, isRendezvous: true };
        return { rendezvous, user, alUsers, updateMyRendezvous };
      }
    }
  } catch (error) {
    message = error;
    console.log(error);
    return { message };
  }
}
module.exports = {
  RendezvousDeleteFunction,
};
