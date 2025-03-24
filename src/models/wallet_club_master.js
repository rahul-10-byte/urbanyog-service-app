"use strict";
module.exports = (sequelize, DataTypes) => {
  const wallet_club_master = sequelize.define(
    "wallet_club_master",
    {
      club_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      club_name: DataTypes.STRING,
      club_entry_point: DataTypes.INTEGER,
      discount_percentage: DataTypes.INTEGER,
      status: DataTypes.INTEGER,
      created_at: DataTypes.STRING,
      updated_at: DataTypes.STRING,
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );
  wallet_club_master.associate = function (models) {
    // associations can be defined here
  };
  return wallet_club_master;
};
