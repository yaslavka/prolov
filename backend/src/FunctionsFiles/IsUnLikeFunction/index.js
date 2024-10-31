const { getUsers } = require("../RedisInfo");
const { decode } = require("jsonwebtoken");
const { GalleryUserModels } = require("../../Models/GalleryUserModels");
const { LikesModels } = require("../../Models/LikesModels");

async function IsUnLikeFunction(req) {
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
        const { id, recipientId } = req;
        const gallery = await GalleryUserModels.findOne({ where: { id: id } });
        await LikesModels.destroy({ where: { galleryUserId: gallery.id } });
        await GalleryUserModels.update(
          { likes: Number(gallery.likes) - 1 },
          { where: { id: gallery.id } },
        );
        const newArrUsers = [...alUsers.filter((us) => us.id !== recipientId)];
        const oldRecipient = {
          ...alUsers.find((recipient) => recipient.id === recipientId),
        };
        const updatedGallery = {
          ...oldRecipient,
          gallery: [
            ...oldRecipient.gallery.map((g) => {
              if (g.id === gallery.id) {
                return {
                  ...g,
                  likes: Number(gallery.likes) - 1,
                  like: g.like.filter(
                    (like) => like.galleryUserId !== gallery.id,
                  ),
                };
              }
              return g;
            }),
          ],
        };
        const allUsers = [...newArrUsers, updatedGallery];
        const user = { ...allUsers.find((u) => u.id === userAuth.id) };
        return { allUsers, user, updatedGallery };
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
  IsUnLikeFunction,
};
