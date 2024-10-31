const { getUsers } = require("../RedisInfo");
const { decode } = require("jsonwebtoken");
const { UserTable } = require("../../Models/UserModels");

async function EyeColorUpdateFunction(req) {
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
        const { eyeColor } = req;
        await UserTable.update({ eyeColor }, { where: { id: userAuth.id } });
        const newArrUsers = alUsers.filter((us) => us.id !== userAuth.id);
        const user = {
          ...userAuth,
          eyeColor: eyeColor,
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
  EyeColorUpdateFunction,
};
