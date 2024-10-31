const { getUsers } = require("../RedisInfo");
const { decode } = require("jsonwebtoken");
const { GalleryUserModels } = require("../../Models/GalleryUserModels");
const { LikesModels } = require("../../Models/LikesModels");
const { CommentsModule } = require("../../Models/CommentsModule");

async function DeleteAvatarFunction(req) {
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
        const { id } = req;
        const newArrUsers = alUsers.filter((us) => us.id !== userAuth.id);
        await GalleryUserModels.destroy({
          where: { id: id },
          include: [
            { model: LikesModels, as: "like" },
            { model: CommentsModule, as: "comment" },
          ],
        });

        const user = {
          ...userAuth,
          gallery: [...userAuth.gallery.filter((g) => g.id !== id)],
        };
        const allUsers = [...newArrUsers, user];
        return { allUsers, user };
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
  DeleteAvatarFunction,
};
