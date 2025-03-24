"use strict";
module.exports = (sequelize, DataTypes) => {
  const product_master = sequelize.define(
    "product_master",
    {
      pid: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      product_id: DataTypes.INTEGER,
      product_name: DataTypes.STRING,
      product_handle: DataTypes.STRING,
      product_category: DataTypes.STRING,
      product_img_url: DataTypes.STRING,
      store_name: DataTypes.STRING,
      created_at: DataTypes.STRING,
      updated_at: DataTypes.STRING,
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );
  product_master.associate = function (models) {
    // associations can be defined here
  };
  return product_master;
};
