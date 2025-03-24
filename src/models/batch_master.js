"use strict";
module.exports = (sequelize, DataTypes) => {
  const batch_master = sequelize.define(
    "batch_master",
    {
      batch_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      batch_name: DataTypes.STRING,
      batch_quantity: DataTypes.INTEGER,
      pid: DataTypes.INTEGER,
      variant_id: DataTypes.INTEGER,
      batch_pdf_url: DataTypes.STRING,
      created_by: DataTypes.STRING,
      created_at: DataTypes.STRING,
      updated_at: DataTypes.STRING,
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );
  batch_master.associate = function (models) {
    // associations can be defined here
  };
  return batch_master;
};
