const { getUsers } = require("../RedisInfo");
const { decode } = require("jsonwebtoken");
const { CommentsModule } = require("../../Models/CommentsModule");

async function CommentCreateFunction(req) {
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
        const { galleryUserId, recipientId, text } = req;
        const newArrUsers = alUsers.filter((us) => us.id !== recipientId);
        const oldRecipient = {
          ...alUsers.find((us) => us.id === recipientId),
        };
        const comment = await CommentsModule.create({
          text: text,
          userId: userAuth.id,
          galleryUserId: galleryUserId,
        });
        const recipientUpdate = {
          ...oldRecipient,
          gallery: [
            ...oldRecipient.gallery.map((g) => {
              if (g.id === galleryUserId) {
                return {
                  ...g,
                  comments: [
                    ...g.comments,
                    {
                      id: comment.id,
                      user: userAuth,
                      replies: [],
                      commentId: null,
                      replyCount: 0,
                      text: text,
                      userId: userAuth.id,
                    },
                  ],
                };
              }
              return g;
            }),
          ],
        };
        const allUsers = [...newArrUsers, recipientUpdate];
        const user = { ...alUsers.find((us) => us.id === userAuth.id) };
        return { allUsers, user, recipientUpdate };
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
  CommentCreateFunction,
};
