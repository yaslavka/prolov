const sequelize = require("../../../db");
const { DataTypes } = require("sequelize");
const { UserTable } = require("../UserModels");

const PaymentsHistory = sequelize.define("paymentsHistory", {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, defaultValue: null },
  price: { type: DataTypes.INTEGER, defaultValue: null },
  userId: { type: DataTypes.BIGINT, defaultValue: null },
  status: { type: DataTypes.BOOLEAN, defaultValue: true },
  dateEnd: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

UserTable.hasMany(PaymentsHistory, { as: "paymentsHistory" });
PaymentsHistory.belongsTo(UserTable, { as: "user" });

module.exports = { PaymentsHistory };
