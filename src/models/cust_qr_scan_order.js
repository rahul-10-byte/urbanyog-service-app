"use strict";
module.exports = (sequelize, DataTypes) => {
  const cust_qr_scan_order = sequelize.define(
    "cust_qr_scan_order",
    {
      cust_scan_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      cust_name: DataTypes.STRING,
      cust_email: DataTypes.STRING,
      cust_number: DataTypes.INTEGER,
      bought_product_pid: DataTypes.INTEGER,
      bought_product: DataTypes.STRING,
      bought_from: DataTypes.STRING,
      created_at: DataTypes.STRING,
      updated_at: DataTypes.STRING,
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );
  cust_qr_scan_order.associate = function (models) {
    // associations can be defined here
  };
  return cust_qr_scan_order;
};
