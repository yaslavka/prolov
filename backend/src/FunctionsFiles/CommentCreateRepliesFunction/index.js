const { getUsers } = require("../RedisInfo");
const { decode } = require("jsonwebtoken");
const { CommentsModule } = require("../../Models/CommentsModule");

async function CommentCreateRepliesFunction(req) {
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
        const { galleryUserId, recipientId, text, commentId } = req;
        const repliesCreate = await CommentsModule.create({
          text: text,
          userId: userAuth.id,
          galleryUserId: galleryUserId,
          commentId: commentId,
        });
        const oldRecipient = {
          ...alUsers.find((us) => us.id === recipientId),
        };
        const oldGalleryUser = [...userAuth.gallery];
        const oldGalleryRecipient = [...oldRecipient.gallery];
        const searchGalleryForUser = {
          ...oldGalleryUser.find((g) => g.id === galleryUserId),
        };
        const searchGalleryForRecipient = {
          ...oldGalleryRecipient.find((g) => g.id === galleryUserId),
        };
        const oldComments =
          searchGalleryForUser?.comments || searchGalleryForRecipient?.comments;
        const newRepliesObject = {
          id: repliesCreate.id,
          user: userAuth,
          replies: [],
          replyCount: Number(oldComments[0].replyCount) + 1,
          text: text,
          userId: userAuth.id,
          commentId: commentId,
        };
        function updateReplies(replies, commentId, newRepliesObject) {
          return replies.map((reply) => {
            if (reply.id === commentId) {
              return {
                ...reply,
                replies: [...reply.replies, { ...newRepliesObject }],
              };
            } else if (reply.replies.length > 0) {
              return {
                ...reply,
                replies: updateReplies(
                  reply.replies,
                  commentId,
                  newRepliesObject,
                ),
              };
            }
            return reply;
          });
        }
        const newCommentsArr = oldComments.map((c) => {
          if (c.id === commentId && c.commentId === null) {
            return {
              ...c,
              replies: [{ ...newRepliesObject }],
            };
          } else {
            return {
              ...c,
              replies: updateReplies(c.replies, commentId, newRepliesObject),
            };
          }
        });
        const resultUpdsteComments = [
          ...alUsers.map((us) => {
            if (us.id === searchGalleryForUser.userId) {
              return {
                ...us,
                gallery: us.gallery.map((g) => {
                  if (g.id === galleryUserId) {
                    return {
                      ...g,
                      comments: [...newCommentsArr],
                    };
                  }
                  return g;
                }),
              };
            }
            return us;
          }),
        ];
        const user = {
          ...resultUpdsteComments.find((us) => us.id === userAuth.id),
        };
        const recipient = {
          ...resultUpdsteComments.find((us) => us.id === recipientId),
        };
        return { user, recipient, resultUpdsteComments };
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
  CommentCreateRepliesFunction,
};
