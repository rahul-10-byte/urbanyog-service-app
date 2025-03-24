
"use strict";
module.exports = (sequelize, DataTypes) => {
  const offline_data_master = sequelize.define(
    "offline_data_master",
    {
        data_id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
          },
          name: DataTypes.STRING,
          product_id: DataTypes.INTEGER,
          product_name: DataTypes.STRING,
          quantity: DataTypes.INTEGER,
          city: DataTypes.STRING,
          created_at: DataTypes.STRING,
          updated_at: DataTypes.STRING,
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );
  offline_data_master.associate = function (models) {
    // associations can be defined here
  };
  return offline_data_master;
};
