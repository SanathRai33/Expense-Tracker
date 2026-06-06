const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db-connection");

const ForgotPasswordRequest = sequelize.define(
  "ForgotPasswordRequest",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }
);

module.exports = ForgotPasswordRequest;