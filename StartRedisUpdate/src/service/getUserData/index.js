const { UserTable } = require("../../Models/UserModels");
const { FavoritesTable } = require("../../Models/FavoritesModel");
const { FriendsTable } = require("../../Models/FriendsModel");
const { Op } = require("sequelize");
const { TopUsersModel } = require("../../Models/TopUsersModel");
const { PaymentsHistory } = require("../../Models/PaymentsHistory");
const {
  GiftSubscriptionsHistory,
} = require("../../Models/GiftSubscriptionsHistory");
const { BlackListUsers } = require("../../Models/BlackListUsers");
const { LikesModels } = require("../../Models/LikesModels");
const { CommentsModule } = require("../../Models/CommentsModule");
const galleryUser = require("../galleryUser");
const buildCommentTree = require("../buildCommentTree");
const { ComplaintsModel } = require("../../Models/ComplaintsModel");
const { ReviewsModel } = require("../../Models/ReviewsModel");

module.exports = async (recipientId) => {
  const userInfo = await UserTable.findOne({ where: { id: recipientId } });
  userInfo.dataValues.vipPrice = 30;
  userInfo.dataValues.topPrice = 30;
  userInfo.dataValues.basepPrice = 30;
  userInfo.dataValues.favorite = await FavoritesTable.findAll({
    where: { userId: userInfo.id },
  });
  userInfo.dataValues.friends = await FriendsTable.findAll({
    where: { [Op.or]: [{ userId: userInfo.id }, { recipientId: userInfo.id }] },
  });
  userInfo.dataValues.tiopUsers = await TopUsersModel.findAll({
    where: { userId: { [Op.ne]: userInfo.id } },
  });
  userInfo.dataValues.paymentsHistory = await PaymentsHistory.findAll({
    where: { userId: userInfo.id },
  });
  userInfo.dataValues.giftSubscriptions =
    await GiftSubscriptionsHistory.findAll({ where: { userId: userInfo.id } });
  userInfo.dataValues.giftSubscriptionsIn =
    await GiftSubscriptionsHistory.findAll({
      where: { recipientId: userInfo.id },
    });
  userInfo.dataValues.blackList = await BlackListUsers.findAll({
    where: { [Op.or]: [{ userId: userInfo.id }, { recipientId: userInfo.id }] },
  });
  userInfo.dataValues.complaints = await ComplaintsModel.findAll({
    where: { [Op.or]: [{ userId: userInfo.id }, { recipientId: userInfo.id }] },
  });
  const review = await ReviewsModel.findAll({
    where: { recipientId: userInfo.id },
  });
  userInfo.dataValues.review = await Promise.all(
    review.map(async (item) => {
      const reviewUser = await UserTable.findOne({
        where: { id: item.dataValues.userId },
      });
      reviewUser.dataValues.gallery = await galleryUser(item.dataValues.userId);
      return {
        ...item.dataValues,
        user: reviewUser,
      };
    }),
  );
  const gallery = await galleryUser(userInfo.id);
  userInfo.dataValues.gallery = await Promise.all(
    gallery.map(async (g) => {
      const like = await LikesModels.findAll({
        where: { galleryUserId: g.id },
      });
      const comments = await CommentsModule.findAll({
        where: { galleryUserId: g.id },
      });
      const commentsUser = await Promise.all(
        comments.map(async (comment) => {
          const commentUser = await UserTable.findOne({
            where: { id: comment.dataValues.userId },
          });
          // const replyCount = comments.filter(i=>i.id === comment.commentId).length
          commentUser.dataValues.gallery = await galleryUser(
            comment.dataValues.userId,
          );
          return {
            ...comment.dataValues,
            user: commentUser,
          };
        }),
      );
      const commentTree = buildCommentTree(commentsUser);
      return {
        ...g.dataValues,
        like: like,
        comments: commentTree,
      };
    }),
  );
  return userInfo;
};
