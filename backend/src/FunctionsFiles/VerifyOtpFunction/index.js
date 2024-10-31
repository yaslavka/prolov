const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { UserTable } = require("../../Models/UserModels");
async function VerifyOtpFunction(req) {
  let message;
  try {
    const { authorization, otp } = req;
    if (!authorization) {
      message = { message: "Вы не авторизованы" };
      return { message };
    } else {
      const { email } = jwt.decode(authorization);
      const user = await UserTable.findOne({ where: { email: email } });
      if (!user) {
        message = { message: "Такой пользователь не найден" };
        return { message };
      } else {
        const comparePassword = await bcrypt.compareSync(otp, user.otp);
        if (!comparePassword) {
          message = { message: "Неверный код из смс" };
          return { message };
        } else {
          await UserTable.update(
            { verification: true },
            { where: { id: user.id } },
          );
          const success = { success: true };
          return { success };
        }
      }
    }
  } catch (error) {
    message = error;
    console.log(error);
    return { message };
  }
}

module.exports = {
  VerifyOtpFunction,
};
