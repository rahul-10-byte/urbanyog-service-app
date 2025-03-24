"use strict";
module.exports = (sequelize, DataTypes) => {
  const customer_wallet_discount = sequelize.define(
    "customer_wallet_discount",
    {
      cust_wallet_discount_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      cust_id: DataTypes.INTEGER,
      wallet_id: DataTypes.INTEGER,
      store_cust_id: DataTypes.INTEGER,
      discount_code: DataTypes.INTEGER,
      discount_value: DataTypes.INTEGER,
      status: DataTypes.INTEGER,
      created_at: DataTypes.STRING,
      updated_at: DataTypes.STRING,
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );
  customer_wallet_discount.associate = function (models) {
    // associations can be defined here
  };
  return customer_wallet_discount;
};
