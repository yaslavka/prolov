const { DataTypes } = require("sequelize");
const sequelize = require("../../../db");
const { UserTable } = require("../UserModels");

const ChatRoomUsers = sequelize.define("chatRoom", {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: 11 },
  room: { type: DataTypes.STRING, defaultValue: null },
  userId: { type: DataTypes.BIGINT, defaultValue: null },
  recipientId: { type: DataTypes.BIGINT, defaultValue: null },
});

UserTable.hasMany(ChatRoomUsers, { as: "chatRoom" });
ChatRoomUsers.belongsTo(UserTable, { as: "user" });
ChatRoomUsers.belongsTo(UserTable, {
  foreignKey: "recipientId",
  as: "recipient",
});

module.exports = { ChatRoomUsers };
