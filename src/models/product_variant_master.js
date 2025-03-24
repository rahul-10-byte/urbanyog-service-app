"use strict";
module.exports = (sequelize, DataTypes) => {
  const product_variant_master = sequelize.define(
    "product_variant_master",
    {
      variant_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      pid: DataTypes.INTEGER,
      shopify_variant_id: DataTypes.INTEGER,
      weight: DataTypes.STRING,
      selling_price: DataTypes.DECIMAL,
      base_price: DataTypes.DECIMAL,
      sku: DataTypes.STRING,
      variant_img_url: DataTypes.STRING,
      store_name: DataTypes.STRING,
      created_at: DataTypes.STRING,
      updated_at: DataTypes.STRING,
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );
  product_variant_master.associate = function (models) {
    // associations can be defined here
  };
  return product_variant_master;
};
