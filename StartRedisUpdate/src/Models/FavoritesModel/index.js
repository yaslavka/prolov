const { DataTypes } = require("sequelize");
const sequelize = require("../../../db");
const { UserTable } = require("../UserModels");

const FavoritesTable = sequelize.define("favorite", {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: 11 },
  status: { type: DataTypes.BOOLEAN, defaultValue: true },
  userId: { type: DataTypes.BIGINT, defaultValue: null },
  recipientId: { type: DataTypes.BIGINT, defaultValue: null },
});
UserTable.hasMany(FavoritesTable, { as: "favorite" });
FavoritesTable.belongsTo(UserTable, { as: "user" });
FavoritesTable.belongsTo(UserTable, {
  foreignKey: "recipientId",
  as: "recipient",
});

module.exports = { FavoritesTable };
