const { DataTypes } = require("sequelize");
const sequelize = require("../../../db");

const ChatRoom = sequelize.define("chatRoomAll", {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: 11 },
  room: { type: DataTypes.STRING, defaultValue: null },
});

module.exports = { ChatRoom };
