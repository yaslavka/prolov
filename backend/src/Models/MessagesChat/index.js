const { DataTypes } = require("sequelize");
const sequelize = require("../../../db");
const { UserTable } = require("../UserModels");
const { ChatRoom } = require("../ChatRoom");

const MessagesChat = sequelize.define(
  "messagesChat",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: 11 },
    message: { type: DataTypes.TEXT, defaultValue: null },
    userId: { type: DataTypes.BIGINT, defaultValue: null },
    chatRoomAllId: { type: DataTypes.BIGINT, defaultValue: null },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { timestamps: true },
);
ChatRoom.hasMany(MessagesChat, { as: "messagesChat" });
MessagesChat.belongsTo(ChatRoom, { as: "chatRoomAll" });

UserTable.hasMany(MessagesChat, { as: "messagesChat" });
MessagesChat.belongsTo(UserTable, { as: "user" });

module.exports = { MessagesChat };
