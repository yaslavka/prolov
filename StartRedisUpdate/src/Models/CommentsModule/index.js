const { DataTypes } = require("sequelize");
const sequelize = require("../../../db");
const { UserTable } = require("../UserModels");
const { GalleryUserModels } = require("../GalleryUserModels");

const CommentsModule = sequelize.define("comment", {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: 11 },
  text: { type: DataTypes.TEXT, defaultValue: null },
  userId: { type: DataTypes.BIGINT, defaultValue: null },
  commentId: { type: DataTypes.BIGINT, defaultValue: null },
  galleryUserId: { type: DataTypes.BIGINT, defaultValue: null },
});

UserTable.hasMany(CommentsModule, { as: "comment" });
CommentsModule.belongsTo(UserTable, { as: "user" });
GalleryUserModels.hasMany(CommentsModule, { as: "comment" });
CommentsModule.belongsTo(GalleryUserModels, {
  as: "galleryUser",
  foreignKey: "galleryUserId",
  onDelete: "CASCADE",
});
CommentsModule.belongsTo(CommentsModule, {
  foreignKey: "commentId",
  as: "comment",
  onDelete: "CASCADE",
});

CommentsModule.hasMany(CommentsModule, {
  foreignKey: "commentId",
  as: "replies",
});

module.exports = { CommentsModule };
