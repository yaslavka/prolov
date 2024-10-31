const { getUsers } = require("../RedisInfo");
const { decode } = require("jsonwebtoken");
const { UserTable } = require("../../Models/UserModels");

async function ReligionUpdateFunction(req) {
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
        const { religion } = req;
        await UserTable.update({ religion }, { where: { id: userAuth.id } });
        const newArrUsers = alUsers.filter((us) => us.id !== userAuth.id);
        const user = {
          ...userAuth,
          religion: religion,
        };
        const allUsers = [...newArrUsers, user];
        return {
          user,
          allUsers,
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
  ReligionUpdateFunction,
};
