const { getUsers } = require("../RedisInfo");
const { decode } = require("jsonwebtoken");
const { FavoritesTable } = require("../../Models/FavoritesModel");

async function AddFavoriteFunction(req) {
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
        const { type } = req;
        switch (type) {
          case "add":
            if (type === "add") {
              const { id } = req;
              const addFavorite = await FavoritesTable.create({
                userId: userAuth.id,
                recipientId: id,
                status: true,
              });
              const newFavorite = {
                id: addFavorite.id,
                userId: userAuth.id,
                recipientId: id,
                status: true,
              };
              const user = {
                ...userAuth,
                favorite: [...userAuth.favorite, newFavorite],
              };
              return { user };
            }
            break;
          case "delete":
            if (type === "delete") {
              const { isDelete } = req;
              await FavoritesTable.destroy({
                where: {
                  userId: userAuth.id,
                  recipientId: isDelete.map((item) => item),
                },
              });
              const user = {
                ...userAuth,
                favorite: [
                  ...userAuth.favorite.filter(
                    (fav) => !isDelete.includes(fav.recipientId),
                  ),
                ],
              };
              return { user };
            }
            break;
          default:
            break;
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
  AddFavoriteFunction,
};
