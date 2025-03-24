"use strict";
module.exports = (sequelize, DataTypes) => {
  const product_suggestion_master = sequelize.define(
    "product_suggestion",
    {
      sugst_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      pid: DataTypes.INTEGER,
      suggst_pid: DataTypes.INTEGER,
      suggst_product_id: DataTypes.INTEGER,
      created_at: DataTypes.STRING,
      updated_at: DataTypes.STRING,
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );
  product_suggestion_master.associate = function (models) {
    // associations can be defined here
  };
  return product_suggestion_master;
};
