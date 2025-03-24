"use strict";
module.exports = (sequelize, DataTypes) => {
  const discount_master = sequelize.define(
    "discount_master",
    {
      discount_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      discount_code: DataTypes.STRING,
      discount_title: DataTypes.STRING,
      discount_type: DataTypes.STRING,
      discount_value: DataTypes.INTEGER,
      minimum_requirement: DataTypes.STRING,
      minimum_quantity: DataTypes.INTEGER,
      minimum_amount: DataTypes.INTEGER,
      usage_limit: DataTypes.INTEGER,
      start_date: DataTypes.STRING,
      end_date: DataTypes.STRING,
      status: DataTypes.INTEGER,
      created_at: DataTypes.STRING,
      updated_at: DataTypes.STRING,
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );
  discount_master.associate = function (models) {
    // associations can be defined here
  };
  return discount_master;
};
