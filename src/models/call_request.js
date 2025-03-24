"use strict";
module.exports = (sequelize, DataTypes) => {
  const call_request = sequelize.define(
    "call_request",
    {
      call_req_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      contact_no: DataTypes.STRING,
      cust_name: DataTypes.STRING,
      cust_email: DataTypes.STRING,
      status: DataTypes.STRING,
      created_at: DataTypes.STRING,
      updated_at: DataTypes.STRING,
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );
  call_request.associate = function (models) {
    // associations can be defined here
  };
  return call_request;
};
