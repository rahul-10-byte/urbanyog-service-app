"use strict";
module.exports = (sequelize, DataTypes) => {
  const shopify_province_master = sequelize.define(
    "shopify_province_master",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      province_id: DataTypes.INTEGER,
      country_id: DataTypes.INTEGER,
      province_name: DataTypes.STRING,
      province_code: DataTypes.STRING,
      province_tax: DataTypes.STRING,
      province_tax_name: DataTypes.STRING,
      province_tax_type: DataTypes.STRING,
      province_shipping_zone_id: DataTypes.STRING,
      tax_percentage: DataTypes.STRING,
      created_at: DataTypes.STRING,
      updated_at: DataTypes.STRING,
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );
  shopify_province_master.associate = function (models) {
    // associations can be defined here
  };
  return shopify_province_master;
};
