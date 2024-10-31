const { DataTypes } = require("sequelize");
const sequelize = require("../../../db");
const { UserTable } = require("../UserModels");

const ComplaintsModel = sequelize.define("complaints", {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: 11 },
  text: { type: DataTypes.TEXT, defaultValue: null },
  userId: { type: DataTypes.BIGINT, defaultValue: null },
  recipientId: { type: DataTypes.BIGINT, defaultValue: null },
});

UserTable.hasMany(ComplaintsModel, { as: "complaints" });
ComplaintsModel.belongsTo(UserTable, { as: "user" });
ComplaintsModel.belongsTo(UserTable, {
  foreignKey: "recipientId",
  as: "recipient",
});

module.exports = { ComplaintsModel };
