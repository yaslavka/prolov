const { getUsers } = require("../RedisInfo");
const { decode } = require("jsonwebtoken");
const { ComplaintsModel } = require("../../Models/ComplaintsModel");

async function SaveComplaintsFunction(req) {
  let message;
  try {
    const allUsers = await getUsers();
    const { authorization } = req;
    if (!authorization) {
      message = { message: "Вы не авторизованы" };
      return { message };
    } else {
      const { email } = decode(authorization);
      const userAuth = { ...allUsers.find((us) => us.email === email) };
      if (!userAuth) {
        message = { message: "Такой пользователь не найден" };
        return { message };
      } else {
        const { recipientId, text } = req;
        await ComplaintsModel.create({
          recipientId: recipientId,
          userId: userAuth.id,
          text: text,
        });
        return { allUsers };
      }
    }
  } catch (error) {}
}
module.exports = {
  SaveComplaintsFunction,
};
