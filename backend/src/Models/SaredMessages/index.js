const { DataTypes } = require("sequelize");
const sequelize = require("../../../db");
const { UserTable } = require("../UserModels");
const { MessagesUsers } = require("../MessagesUsers");

const SharedMessages = sequelize.define(
  "shared",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: 11 },
    message: { type: DataTypes.TEXT, defaultValue: null },
    mediaFile: { type: DataTypes.TEXT, defaultValue: null },
    userId: { type: DataTypes.BIGINT, defaultValue: null },
    recipientId: { type: DataTypes.BIGINT, defaultValue: null },
    type: { type: DataTypes.TEXT, defaultValue: null },
    messageId: { type: DataTypes.BIGINT, defaultValue: null },
    status: { type: DataTypes.BOOLEAN, defaultValue: false },
    friends: { type: DataTypes.BOOLEAN, defaultValue: false },
    friendsS: { type: DataTypes.BOOLEAN, defaultValue: false },
    chatRoomId: { type: DataTypes.BIGINT, defaultValue: null },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { timestamps: true },
);
MessagesUsers.hasMany(SharedMessages, { as: "shared" });
SharedMessages.belongsTo(MessagesUsers, { as: "chatRoom" });

UserTable.hasMany(SharedMessages, { as: "shared" });
SharedMessages.belongsTo(UserTable, { as: "user" });
SharedMessages.belongsTo(UserTable, {
  foreignKey: "recipientId",
  as: "recipient",
});

module.exports = { MessagesUsers };
