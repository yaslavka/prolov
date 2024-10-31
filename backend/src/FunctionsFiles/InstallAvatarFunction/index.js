const { getUsers } = require("../RedisInfo");
const { decode } = require("jsonwebtoken");
const { GalleryUserModels } = require("../../Models/GalleryUserModels");
const { Op } = require("sequelize");

async function InstallAvatarFunction(req) {
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
        const newArrUsers = alUsers.filter((us) => us.id !== userAuth.id);
        const { id } = req;
        await GalleryUserModels.update(
          { isAvatar: true },
          { where: { id: id, userId: userAuth.id } },
        );
        await GalleryUserModels.update(
          { isAvatar: false },
          {
            where: { id: { [Op.ne]: id }, isAvatar: true, userId: userAuth.id },
          },
        );
        const user = {
          ...userAuth,
          gallery: [
            ...userAuth.gallery.map((g) =>
              g.id === id
                ? { ...g, isAvatar: true }
                : { ...g, isAvatar: false },
            ),
          ],
        };
        const allUsers = [...newArrUsers, user];
        return { user, allUsers };
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
  InstallAvatarFunction,
};
