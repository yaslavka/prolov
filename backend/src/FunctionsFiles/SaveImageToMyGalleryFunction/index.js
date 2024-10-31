const { getUsers } = require("../RedisInfo");
const { decode } = require("jsonwebtoken");
const { SveMedia } = require("../SveMedia");
const { GalleryUserModels } = require("../../Models/GalleryUserModels");

async function SaveImageToMyGalleryFunction(req) {
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
        const { mediaFile, mime } = req;
        const fileNameImage = `img_${Date.now()}.gif`;
        const imgPath = `./files/photos/${fileNameImage}`;
        await SveMedia(imgPath, mediaFile);
        const gallery = await GalleryUserModels.create({
          img: fileNameImage,
          userId: userAuth.id,
          type: mime,
        });
        const newObject = {
          ...gallery.dataValues,
          comments: [],
          like: [],
        };
        const user = {
          ...alUsers.find((us) => us.id === userAuth.id),
          gallery: [...userAuth.gallery, newObject],
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
  SaveImageToMyGalleryFunction,
};
