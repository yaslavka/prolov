const { getUsers } = require("../RedisInfo");
const { decode } = require("jsonwebtoken");
const { RendezvousModel } = require("../../Models/RendezvousModel");

async function RendezvousCreateFunction(req) {
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
        const { ageMin, ageMax, time, sex, text, country, city, createdAt } =
          req;
        const rendezvousCreate = await RendezvousModel.create({
          ageMin: ageMin,
          ageMax: ageMax,
          time: time,
          sex: sex,
          text: text,
          country: country,
          city: city,
          userId: userAuth.id,
          createdAt: createdAt,
        });
        const newRendezvous = {
          ageMin: ageMin,
          ageMax: ageMax,
          time: time,
          sex: sex,
          text: text,
          country: country,
          status: true,
          city: city,
          user: userAuth,
          usersId: "[]",
          userId: userAuth.id,
          createdAt: createdAt,
          updatedAt: rendezvousCreate.updatedAt,
        };
        return { newRendezvous, allUsers };
      }
    }
  } catch (error) {
    message = error;
    console.log(message);
    return { message };
  }
}
module.exports = {
  RendezvousCreateFunction,
};
