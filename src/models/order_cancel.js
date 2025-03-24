"use strict";
module.exports = (sequelize, DataTypes) => {
  const order_cancel = sequelize.define(
    "order_cancel",
    {
      cancel_order_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      store_order_id: DataTypes.INTEGER,
      store_order_number: DataTypes.INTEGER,
      store_cust_id: DataTypes.INTEGER,
      cancel_reason: DataTypes.STRING,
      store_id: DataTypes.INTEGER,
      created_at: DataTypes.STRING,
      updated_at: DataTypes.STRING,
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );
  order_cancel.associate = function (models) {
    // associations can be defined here
  };
  return order_cancel;
};
