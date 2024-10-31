const sequelize = require("../../../db");
const { UserTable } = require("../UserModels");
const { DataTypes } = require("sequelize");

const GalleryUserModels = sequelize.define("galleryUser", {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  img: { type: DataTypes.STRING, defaultValue: null },
  type: { type: DataTypes.STRING, defaultValue: null },
  isAvatar: { type: DataTypes.BOOLEAN, defaultValue: false },
  likes: { type: DataTypes.INTEGER, defaultValue: 0 },
  userId: { type: DataTypes.BIGINT, defaultValue: null },
});

UserTable.hasMany(GalleryUserModels, { as: "galleryUser" });
GalleryUserModels.belongsTo(UserTable, { as: "user" });
module.exports = { GalleryUserModels };
