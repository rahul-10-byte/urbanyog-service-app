"use strict";
module.exports = (sequelize, DataTypes) => {
  const third_party_master = sequelize.define(
    "third_party_master",
    {
      tp_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      tp_name: DataTypes.STRING,
      created_at: DataTypes.STRING,
      updated_at: DataTypes.STRING,
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );
  third_party_master.associate = function (models) {
    // associations can be defined here
  };
  return third_party_master;
};
