"use strict";
module.exports = (sequelize, DataTypes) => {
  const cust_feedback = sequelize.define(
    "cust_feedback",
    {
      cust_feedack_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      phone: DataTypes.STRING,
      feedback: DataTypes.STRING,
      created_at: DataTypes.STRING,
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );
  cust_feedback.associate = function (models) {
    // associations can be defined here
  };
  return cust_feedback;
};
