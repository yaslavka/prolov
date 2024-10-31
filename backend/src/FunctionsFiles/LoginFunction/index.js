const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getUsers } = require("../RedisInfo");
const { UserTable } = require("../../Models/UserModels");
const { SendEmailFunction } = require("../SendEmailFunction");
const decode = "random_key";
const generateJwt = (email) => {
  return jwt.sign({ email: email }, decode);
};
async function LoginFunction(req) {
  let message;
  try {
    const allUsers = await getUsers();
    const { email, password, latitude, longitude } = req;
    const user = allUsers.find((us) => us.email === email);
    if (!user) {
      message = { message: "Не верный Email" };
      return { message };
    } else {
      const comparePassword = await bcrypt.compareSync(password, user.password);
      if (!comparePassword) {
        message = { message: "Неверный пароль" };
        return { message };
      } else {
        const otp = `${Math.floor(10000 + Math.random() * 90000)}`;
        const hashOtp = await bcrypt.hash(otp, 10);
        await UserTable.update(
          { lat: latitude, lon: longitude, otp: hashOtp },
          { where: { id: user.id } },
        );
        await SendEmailFunction(
          email,
          "Подтверждение Авторизации PRELOVE",
          `Здравствуйте! Вы выполнили Авторизации в приложении PRELOVE Ваш email: ${email} Ваш код подтверждения: ${otp} Данное сообщение отправлено автоматически, отвечать на него не нужно. `,
        );
        const access_token = generateJwt(email);
        return { access_token, email };
      }
    }
  } catch (error) {
    message = error;
    console.log(error);
    return { message };
  }
}

module.exports = {
  LoginFunction,
};
