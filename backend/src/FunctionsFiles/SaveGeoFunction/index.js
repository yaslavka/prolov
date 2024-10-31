const { getUsers } = require("../RedisInfo");
const { decode } = require("jsonwebtoken");
const { UserTable } = require("../../Models/UserModels");

async function SaveGeoFunction(req) {
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
        const { country, city } = req;
        await UserTable.update(
          { country, city, isEditGeo: true },
          { where: { id: userAuth.id } },
        );
        const newArrUsers = alUsers.filter((us) => us.id !== userAuth.id);
        const user = {
          ...userAuth,
          country: country,
          city: city,
          isEditGeo: true,
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
  SaveGeoFunction,
};
