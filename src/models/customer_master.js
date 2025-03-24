"use strict";
module.exports = (sequelize, DataTypes) => {
  const customer_master = sequelize.define(
    "customer_master",
    {
      cust_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      shopify_customer_id: DataTypes.INTEGER,
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      email: DataTypes.STRING,
      phone: DataTypes.STRING,
      gender: DataTypes.STRING,
      dob: DataTypes.STRING,
      created_at: DataTypes.STRING,
      updated_at: DataTypes.STRING,
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );
  customer_master.associate = function (models) {
    // associations can be defined here
  };
  return customer_master;
};
