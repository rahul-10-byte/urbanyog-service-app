"use strict";
module.exports = (sequelize, DataTypes) => {
  const customer_profile_img = sequelize.define(
    "customer_profile_img",
    {
      cust_profile_img_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      store_cust_id: DataTypes.INTEGER,
      img_path: DataTypes.STRING,
      created_at: DataTypes.STRING,
      updated_at: DataTypes.STRING,
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );
  customer_profile_img.associate = function (models) {
    // associations can be defined here
  };
  return customer_profile_img;
};
