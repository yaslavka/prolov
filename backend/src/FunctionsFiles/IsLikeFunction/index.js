const { getUsers } = require("../RedisInfo");
const { decode } = require("jsonwebtoken");
const { GalleryUserModels } = require("../../Models/GalleryUserModels");
const { LikesModels } = require("../../Models/LikesModels");

async function IsLikeFunction(req) {
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
        const newArrUsers = alUsers.filter((us) => us.id !== recipientId);
        const gallery = await GalleryUserModels.findOne({ where: { id: id } });
        const oldRecipient = {
          ...alUsers.find((recipient) => recipient.id === recipientId),
        };
        const like = await LikesModels.create({
          userId: userAuth.id,
          galleryUserId: gallery.id,
        });
        await GalleryUserModels.update(
          { likes: Number(gallery.likes) + 1 },
          { where: { id: gallery.id } },
        );
        const updatedGalleryRecipient = {
          ...oldRecipient,
          gallery: [
            ...oldRecipient.gallery.map((g) =>
              g.id === gallery.id
                ? {
                    ...g,
                    likes: Number(gallery.likes) + 1,
                    like: [
                      ...g.like,
                      {
                        id: like.id,
                        userId: userAuth.id,
                        galleryUserId: gallery.id,
                      },
                    ],
                  }
                : g,
            ),
          ],
        };
        const allUsers = [...newArrUsers, updatedGalleryRecipient];
        const user = { ...allUsers.find((u) => u.id === userAuth.id) };
        return { allUsers, user, updatedGalleryRecipient };
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
  IsLikeFunction,
};
