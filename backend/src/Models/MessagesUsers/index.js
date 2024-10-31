const { DataTypes } = require("sequelize");
const sequelize = require("../../../db");
const { UserTable } = require("../UserModels");
const { ChatRoomUsers } = require("../ChatRoomUsers");

const MessagesUsers = sequelize.define(
  "messages",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: 11 },
    message: { type: DataTypes.TEXT, defaultValue: null },
    shared: { type: DataTypes.JSON, defaultValue: [] },
    mediaFile: { type: DataTypes.TEXT, defaultValue: null },
    userId: { type: DataTypes.BIGINT, defaultValue: null },
    recipientId: { type: DataTypes.BIGINT, defaultValue: null },
    type: { type: DataTypes.TEXT, defaultValue: null },
    status: { type: DataTypes.BOOLEAN, defaultValue: false },
    friends: { type: DataTypes.BOOLEAN, defaultValue: false },
    friendsS: { type: DataTypes.BOOLEAN, defaultValue: false },
    chatRoomId: { type: DataTypes.BIGINT, defaultValue: null },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { timestamps: true },
);
ChatRoomUsers.hasMany(MessagesUsers, { as: "messages" });
MessagesUsers.belongsTo(ChatRoomUsers, { as: "chatRoom" });

UserTable.hasMany(MessagesUsers, { as: "messages" });
MessagesUsers.belongsTo(UserTable, { as: "user" });
MessagesUsers.belongsTo(UserTable, {
  foreignKey: "recipientId",
  as: "recipient",
});

module.exports = { MessagesUsers };
