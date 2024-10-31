const { getUsers, updateAllUsers } = require("../RedisInfo");
const bcrypt = require("bcrypt");
const { UserTable } = require("../../Models/UserModels");
const { InsertUserInOrderFunction } = require("../InsertUserInOrderFunction");
const { SendEmailFunction } = require("../SendEmailFunction");
const jwt = require("jsonwebtoken");
const decode = "random_key";
const generateJwt = (email) => {
  return jwt.sign({ email: email }, decode);
};
async function ResetPasswordFunction(req) {
  let message;
  try {
    const alUsers = await getUsers();
    const { email } = req;
    const userAuth = alUsers.find((us) => us.email === email);
    const newArrAllUsers = [...alUsers.filter((us) => us.id !== userAuth.id)];
    if (!userAuth) {
      message = { message: "Такого пользователя не существует" };
      return { message };
    } else {
      const { aCodeword, password } = req;
      const compareACodeword = await bcrypt.compareSync(
        aCodeword,
        userAuth.aCodeword,
      );
      if (!compareACodeword) {
        message = { message: "Неверный пароль или кодовое слово" };
        return { message };
      } else {
        const hashPassword = await bcrypt.hash(password, 10);
        const otp = `${Math.floor(10000 + Math.random() * 90000)}`;
        const hashOtp = await bcrypt.hash(otp, 10);
        await UserTable.update(
          { password: hashPassword, otp: hashOtp },
          { where: { id: userAuth.id } },
        );
        const user = { ...userAuth, password: hashPassword, otp: hashOtp };
        let newArr = [...newArrAllUsers];
        newArr = await InsertUserInOrderFunction(newArr, user);
        await updateAllUsers(newArr);
        await SendEmailFunction(
          email,
          "Вы запросили сброс пароля PROLOVE",
          `Здравствуйте! Вы выполнили сброс пароля в приложении PRELOVE Ваш email: ${email} Ваш код подтверждения: ${otp} Данное сообщение отправлено автоматически, отвечать на него не нужно. `,
        );
        const access_token = generateJwt(email);
        return { access_token, email };
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
  ResetPasswordFunction,
};
