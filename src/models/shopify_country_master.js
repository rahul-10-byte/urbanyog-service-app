"use strict";
module.exports = (sequelize, DataTypes) => {
  const shopify_country_master = sequelize.define(
    "shopify_country_master",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      country_name: DataTypes.STRING,
      country_id: DataTypes.INTEGER,
      country_tax: DataTypes.STRING,
      country_code: DataTypes.STRING,
      tax_name: DataTypes.STRING,
      created_at: DataTypes.STRING,
      updated_at: DataTypes.STRING,
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );
  shopify_country_master.associate = function (models) {
    // associations can be defined here
  };
  return shopify_country_master;
};
