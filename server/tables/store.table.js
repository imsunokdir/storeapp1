const { DataTypes } = require("sequelize");
const sequelize = require("../configs/db");

const Store = sequelize.define(
  "Store",
  {
    name: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING(400),
      allowNull: false,
    },
    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "stores",
    timestamps: true,
  }
);

module.exports = Store;
