"use strict";
module.exports = (sequelize, DataTypes) => {
  const qr_master = sequelize.define(
    "qr_master",
    {
      qr_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      qr_code: DataTypes.STRING,
      pid: DataTypes.INTEGER,
      variant_id: DataTypes.INTEGER,
      status: DataTypes.INTEGER,
      created_at: DataTypes.STRING,
      updated_at: DataTypes.STRING,
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );
  qr_master.associate = function (models) {
    // associations can be defined here
  };
  return qr_master;
};
