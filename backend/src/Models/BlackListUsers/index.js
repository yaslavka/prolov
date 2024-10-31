const { DataTypes } = require("sequelize");
const sequelize = require("../../../db");
const { UserTable } = require("../UserModels");

const BlackListUsers = sequelize.define("blackList", {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: 11 },
  status: { type: DataTypes.BOOLEAN, defaultValue: true },
  userId: { type: DataTypes.BIGINT, defaultValue: null },
  chatRoomId: { type: DataTypes.BIGINT, defaultValue: null },
  recipientId: { type: DataTypes.BIGINT, defaultValue: null },
});

UserTable.hasMany(BlackListUsers, { as: "blackList" });
BlackListUsers.belongsTo(UserTable, { as: "user" });
BlackListUsers.belongsTo(UserTable, {
  foreignKey: "recipientId",
  as: "recipient",
});

module.exports = { BlackListUsers };
