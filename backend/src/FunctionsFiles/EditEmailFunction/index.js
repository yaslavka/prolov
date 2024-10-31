const { getUsers, updateAllUsers } = require("../RedisInfo");
const { decode, sign } = require("jsonwebtoken");
const { UserTable } = require("../../Models/UserModels");
const { InsertUserInOrderFunction } = require("../InsertUserInOrderFunction");

const key = "random_key";

const generateJwt = (email) => {
  return sign({ email: email }, key);
};
async function EditEmailFunction(req) {
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
        await UserTable.update(
          { email: req.email },
          { where: { id: userAuth.id } },
        );
        const user = { ...userAuth, email: req.email };
        let newArr = [...newArrAllUsers];
        newArr = await InsertUserInOrderFunction(newArr, user);
        await updateAllUsers(newArr);
        const access_token = generateJwt(req.email);
        return {
          user,
          access_token,
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
  EditEmailFunction,
};
