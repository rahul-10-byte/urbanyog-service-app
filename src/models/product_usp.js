"use strict";
module.exports = (sequelize, DataTypes) => {
  const product_usp = sequelize.define(
    "product_usp",
    {
      prod_usp_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      usp_title: DataTypes.STRING,
      pid: DataTypes.INTEGER,
      product_id: DataTypes.INTEGER,
      created_at: DataTypes.STRING,
      updated_at: DataTypes.STRING,
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );
  product_usp.associate = function (models) {
    // associations can be defined here
  };
  return product_usp;
};
