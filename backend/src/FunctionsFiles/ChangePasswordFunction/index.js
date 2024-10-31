const { getUsers, updateAllUsers } = require("../RedisInfo");
const { decode } = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { InsertUserInOrderFunction } = require("../InsertUserInOrderFunction");
const { UserTable } = require("../../Models/UserModels");

async function ChangePasswordFunction(req) {
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
      const newArrAllUsers = [...alUsers.filter((us) => us.id !== userAuth.id)];
      if (!userAuth) {
        message = { message: "Такой пользователь не найден" };
        return { message };
      } else {
        const { oldPassword, aCodeword, password } = req;
        const comparePassword = await bcrypt.compareSync(
          oldPassword,
          userAuth.password,
        );
        const compareACodeword = await bcrypt.compareSync(
          aCodeword,
          userAuth.aCodeword,
        );
        if (!comparePassword || !compareACodeword) {
          message = { message: "Неверный пароль или кодовое слово" };
          return { message };
        } else {
          const hashPassword = await bcrypt.hash(password, 10);
          await UserTable.update(
            { password: hashPassword },
            { where: { id: userAuth.id } },
          );
          const user = { ...userAuth, password: hashPassword };
          let newArr = [...newArrAllUsers];
          newArr = await InsertUserInOrderFunction(newArr, user);
          await updateAllUsers(newArr);
          message = { message: "Пароль успешно обновлен" };
          return { message };
        }
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
  ChangePasswordFunction,
};
