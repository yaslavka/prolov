const { DataTypes } = require("sequelize");
const sequelize = require("../../../db");
const { UserTable } = require("../UserModels");
const { RendezvousModel } = require("../RendezvousModel");

const RendezvousHistoryModel = sequelize.define("rendezvousHistory", {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: 11 },
  status: { type: DataTypes.BOOLEAN, defaultValue: false },
  cancel: { type: DataTypes.BOOLEAN, defaultValue: false },
  userId: { type: DataTypes.BIGINT, defaultValue: null },
  recipientId: { type: DataTypes.BIGINT, defaultValue: null },
  proposalId: { type: DataTypes.BIGINT, defaultValue: null },
  usersId: { type: DataTypes.JSON, defaultValue: [] },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

UserTable.hasMany(RendezvousHistoryModel, { as: "rendezvousHistory" });
RendezvousHistoryModel.belongsTo(UserTable, { as: "user" });
RendezvousHistoryModel.belongsTo(UserTable, {
  foreignKey: "recipientId",
  as: "recipient",
});

RendezvousModel.hasMany(RendezvousHistoryModel, { as: "rendezvousHistory" });
RendezvousHistoryModel.belongsTo(RendezvousModel, { as: "proposal" });

module.exports = { RendezvousHistoryModel };
