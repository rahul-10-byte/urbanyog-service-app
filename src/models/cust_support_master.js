"use strict";
module.exports = (sequelize, DataTypes) => {
  const cust_support_master = sequelize.define(
    "cust_support_master",
    {
      support_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      store_order_id: DataTypes.INTEGER,
      store_order_number: DataTypes.INTEGER,
      cust_email: DataTypes.STRING,
      issue: DataTypes.STRING,
      status: DataTypes.INTEGER,
      created_at: DataTypes.STRING,
      updated_at: DataTypes.STRING,
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );
  cust_support_master.associate = function (models) {
    // associations can be defined here
  };
  return cust_support_master;
};
