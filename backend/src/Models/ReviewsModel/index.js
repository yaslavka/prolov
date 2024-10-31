const { DataTypes } = require("sequelize");
const sequelize = require("../../../db");
const { UserTable } = require("../UserModels");

const ReviewsModel = sequelize.define("review", {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: 11 },
  text: { type: DataTypes.TEXT, defaultValue: null },
  userId: { type: DataTypes.BIGINT, defaultValue: null },
  recipientId: { type: DataTypes.BIGINT, defaultValue: null },
});
UserTable.hasMany(ReviewsModel, { as: "review" });
ReviewsModel.belongsTo(UserTable, { as: "user" });
ReviewsModel.belongsTo(UserTable, {
  foreignKey: "recipientId",
  as: "recipient",
});
module.exports = { ReviewsModel };
