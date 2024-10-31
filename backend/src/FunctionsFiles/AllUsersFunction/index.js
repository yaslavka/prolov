const { getUsers } = require("../RedisInfo");
const { decode } = require("jsonwebtoken");

async function AllUsersFunction(req) {
  let message;
  try {
    const alUsers = await getUsers();
    const { authorization } = req;
    if (!authorization) {
      message = { message: "Вы не авторизованы" };
      return { message };
    } else {
      const { email } = decode(authorization);
      const user = { ...alUsers.find((us) => us.email === email) };
      if (!user) {
        message = { message: "Такой пользователь не найден" };
        return { message };
      } else {
        const users = [...alUsers.filter((us) => us.id !== user.id)];
        return { users, user };
      }
    }
  } catch (error) {
    message = error;
    console.log(error);
    return { message };
  }
}

module.exports = {
  AllUsersFunction,
};
