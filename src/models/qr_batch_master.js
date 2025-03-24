"use strict";
module.exports = (sequelize, DataTypes) => {
  const qr_batch_master = sequelize.define(
    "qr_batch_master",
    {
      qr_batch_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      batch_id: DataTypes.INTEGER,
      qr_id: DataTypes.INTEGER,
      qr_img: DataTypes.STRING,
      qr_img_uri: DataTypes.STRING,
      product_qr_img: DataTypes.STRING,
      product_qr_img_uri: DataTypes.STRING,
      created_at: DataTypes.STRING,
      updated_at: DataTypes.STRING,
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );
  qr_batch_master.associate = function (models) {
    // associations can be defined here
  };
  return qr_batch_master;
};
