const { DataTypes } = require("sequelize");
const sequelize = require("../../../db");
const { UserTable } = require("../UserModels");
const { GalleryUserModels } = require("../GalleryUserModels");

const LikesModels = sequelize.define("like", {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: 11 },
  userId: { type: DataTypes.BIGINT, defaultValue: null },
  galleryUserId: { type: DataTypes.BIGINT, defaultValue: null },
});

UserTable.hasMany(LikesModels, { as: "like" });
LikesModels.belongsTo(UserTable, { as: "user" });
GalleryUserModels.hasMany(LikesModels, { as: "like" });
LikesModels.belongsTo(GalleryUserModels, {
  as: "galleryUser",
  foreignKey: "galleryUserId",
  onDelete: "CASCADE",
});

module.exports = { LikesModels };
