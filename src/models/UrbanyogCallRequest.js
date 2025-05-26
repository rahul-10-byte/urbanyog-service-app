"use strict";
module.exports = (sequelize, DataTypes) => {
  const UrbanyogCallRequest = sequelize.define(
    "UrbanyogCallRequest",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      custName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      contactNo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      productName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "urbanyog_call_requests", // Explicit table name
      freezeTableName: true,
      timestamps: false, // Set to true if you have createdAt/updatedAt columns
    }
  );

  UrbanyogCallRequest.associate = function (models) {
    // Define associations here, if any
  };

  return UrbanyogCallRequest;
};
