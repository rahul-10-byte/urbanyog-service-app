"use strict";
module.exports = (sequelize, DataTypes) => {
  const customer_wallet_history = sequelize.define(
    "customer_wallet_history",
    {
      wallet_history_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      wallet_id: DataTypes.INTEGER,
      store_order_number: DataTypes.INTEGER,
      store_order_id: DataTypes.INTEGER,
      cust_id: DataTypes.INTEGER,
      store_cust_id: DataTypes.INTEGER,
      transaction_type: DataTypes.STRING,
      transaction_amount: DataTypes.INTEGER,
      discount_id: DataTypes.INTEGER,
      pid: DataTypes.INTEGER,
      tpm_id: DataTypes.INTEGER,
      transaction_note: DataTypes.STRING,
      transaction_status: DataTypes.STRING,
      status: DataTypes.INTEGER,
      created_at: DataTypes.STRING,
      updated_at: DataTypes.STRING,
      expired_at: DataTypes.STRING,
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );
  customer_wallet_history.associate = function (models) {
    // associations can be defined here
  };
  return customer_wallet_history;
};
