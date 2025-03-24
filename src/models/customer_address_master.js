"use strict";
module.exports = (sequelize, DataTypes) => {
  const customer_address_master = sequelize.define(
    "customer_address_master",
    {
      address_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      store_address_id: DataTypes.INTEGER,
      cust_id: DataTypes.INTEGER,
      store_cust_id: DataTypes.INTEGER,
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      company: DataTypes.STRING,
      address1: DataTypes.STRING,
      address2: DataTypes.STRING,
      city: DataTypes.STRING,
      province: DataTypes.STRING,
      country: DataTypes.STRING,
      zip: DataTypes.INTEGER,
      phone: DataTypes.STRING,
      name: DataTypes.STRING,
      province_code: DataTypes.STRING,
      country_code: DataTypes.STRING,
      country_name: DataTypes.STRING,
      default: DataTypes.STRING,
      address_type: DataTypes.STRING,
      created_at: DataTypes.STRING,
      updated_at: DataTypes.STRING,
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );
  customer_address_master.associate = function (models) {
    // associations can be defined here
  };
  return customer_address_master;
};
