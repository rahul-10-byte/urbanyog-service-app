"use strict";
module.exports = (sequelize, DataTypes) => {
  const survey_master = sequelize.define(
    "survey_master",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      survey_name: DataTypes.STRING,
      created_at: DataTypes.STRING,
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );
  survey_master.associate = function (models) {
    // associations can be defined here
  };
  return survey_master;
};
