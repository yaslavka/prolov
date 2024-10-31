const sequelize = require("../../../db");
const { DataTypes } = require("sequelize");
const { UserTable } = require("../UserModels");

const GiftSubscriptionsHistory = sequelize.define("giftSubscriptionsHistory", {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, defaultValue: null },
  price: { type: DataTypes.INTEGER, defaultValue: null },
  count: { type: DataTypes.INTEGER, defaultValue: null },
  userId: { type: DataTypes.BIGINT, defaultValue: null },
  status: { type: DataTypes.BOOLEAN, defaultValue: true },
  recipientId: { type: DataTypes.BIGINT, defaultValue: null },
  dateEnd: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

UserTable.hasMany(GiftSubscriptionsHistory, { as: "giftSubscriptionsHistory" });
GiftSubscriptionsHistory.belongsTo(UserTable, { as: "user" });
GiftSubscriptionsHistory.belongsTo(UserTable, {
  foreignKey: "recipientId",
  as: "recipient",
});

module.exports = { GiftSubscriptionsHistory };
