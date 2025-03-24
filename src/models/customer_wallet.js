"use strict";
module.exports = (sequelize, DataTypes) => {
  const customer_wallet = sequelize.define(
    "customer_wallet",
    {
      wallet_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      cust_id: DataTypes.INTEGER,
      store_cust_id: DataTypes.INTEGER,
      total_amount: DataTypes.INTEGER,
      club_id: DataTypes.INTEGER,
      status: DataTypes.INTEGER,
      created_at: DataTypes.STRING,
      updated_at: DataTypes.STRING,
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );
  customer_wallet.associate = function (models) {
    // associations can be defined here
  };
  return customer_wallet;
};
