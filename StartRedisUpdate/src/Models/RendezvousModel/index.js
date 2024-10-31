const { DataTypes } = require("sequelize");
const sequelize = require("../../../db");
const { UserTable } = require("../UserModels");

const RendezvousModel = sequelize.define("proposal", {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: 11 },
  ageMin: { type: DataTypes.INTEGER, defaultValue: null },
  ageMax: { type: DataTypes.INTEGER, defaultValue: null },
  time: { type: DataTypes.STRING, defaultValue: null },
  sex: { type: DataTypes.STRING, defaultValue: null },
  text: { type: DataTypes.TEXT, defaultValue: null },
  country: { type: DataTypes.STRING, defaultValue: null },
  city: { type: DataTypes.STRING, defaultValue: null },
  usersId: { type: DataTypes.JSON, defaultValue: [] },
  status: { type: DataTypes.BOOLEAN, defaultValue: true },
  userId: { type: DataTypes.BIGINT, defaultValue: null },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

UserTable.hasMany(RendezvousModel, { as: "proposal" });
RendezvousModel.belongsTo(UserTable, { as: "user" });

module.exports = { RendezvousModel };
