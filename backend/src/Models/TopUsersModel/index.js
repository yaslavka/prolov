const { DataTypes } = require("sequelize");
const sequelize = require("../../../db");
const { UserTable } = require("../UserModels");

const TopUsersModel = sequelize.define("topUsers", {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: 11 },
  userId: { type: DataTypes.BIGINT, defaultValue: null },
});
UserTable.hasMany(TopUsersModel, { as: "topUsers" });
TopUsersModel.belongsTo(UserTable, { as: "user" });

module.exports = { TopUsersModel };
