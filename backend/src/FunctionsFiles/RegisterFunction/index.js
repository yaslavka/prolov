const { UserTable } = require("../../Models/UserModels");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SendEmailFunction } = require("../SendEmailFunction");
const decode = "random_key";
const generateJwt = (email) => {
  return jwt.sign({ email: email }, decode);
};
async function RegisterFunction(req) {
  let message;
  try {
    const {
      email,
      fullName,
      password,
      sex,
      day,
      month,
      year,
      gender,
      country,
      city,
      aCodeword,
      latitude,
      longitude,
    } = req;
    const candidateEmail = await UserTable.findOne({
      where: { email: email },
    });
    if (candidateEmail) {
      message = { message: "Такой email уже существует" };
      return { message };
    } else {
      const hashPassword = await bcrypt.hash(password, 10);
      const hashACodeword = await bcrypt.hash(aCodeword, 10);
      const otp = `${Math.floor(10000 + Math.random() * 90000)}`;
      const hashOtp = await bcrypt.hash(otp, 10);
      await UserTable.create({
        fullName: fullName,
        email: email,
        password: hashPassword,
        aCodeword: hashACodeword,
        sex: sex,
        day: day,
        month: month,
        year: year,
        gender: gender,
        country: country,
        city: city,
        lat: latitude,
        lon: longitude,
        otp: hashOtp,
      });
      await SendEmailFunction(
        email,
        "Подтверждение Регистрации PRELOVE",
        `Здравствуйте! Вы выполнили Регистрацию в приложении PRELOVE Ваш email: ${email} Ваш код подтверждения: ${otp} Данное сообщение отправлено автоматически, отвечать на него не нужно. `,
      );
      const access_token = generateJwt(email);
      return { access_token, email };
    }
  } catch (error) {
    message = error;
    console.log(error);
    return { message };
  }
}
module.exports = {
  RegisterFunction,
};
