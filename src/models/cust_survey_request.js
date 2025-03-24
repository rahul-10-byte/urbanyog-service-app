"use strict";
module.exports = (sequelize, DataTypes) => {
  const cust_survey_request = sequelize.define(
    "cust_survey_request",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      survey_name: DataTypes.STRING,
      email: DataTypes.STRING,
      created_at: DataTypes.STRING,
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );
  cust_survey_request.associate = function (models) {
    // associations can be defined here
  };
  return cust_survey_request;
};
