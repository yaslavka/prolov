const { DataTypes } = require("sequelize");
const sequelize = require("../../../db");
const { UserTable } = require("../UserModels");

const FriendsTable = sequelize.define("friends", {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: 11 },
  count: { type: DataTypes.INTEGER, defaultValue: null },
  hidden: { type: DataTypes.JSON, defaultValue: [] },
  status: { type: DataTypes.BOOLEAN, defaultValue: false },
  price: { type: DataTypes.INTEGER, defaultValue: null },
  userId: { type: DataTypes.BIGINT, defaultValue: null },
  recipientId: { type: DataTypes.BIGINT, defaultValue: null },
});
UserTable.hasMany(FriendsTable, { as: "friends" });
FriendsTable.belongsTo(UserTable, { as: "user" });
FriendsTable.belongsTo(UserTable, {
  foreignKey: "recipientId",
  as: "recipient",
});

module.exports = { FriendsTable };
