"use strict";

module.exports = (sequelize, DataTypes) => {
  const product_review_file_upload = sequelize.define(
    "product_review_file_upload",
    {
      file_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      review_id: DataTypes.INTEGER,
      file_type: DataTypes.INTEGER,
      file_path: DataTypes.STRING,
      created_at: DataTypes.STRING,
      updated_at: DataTypes.STRING,
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );
  product_review_file_upload.associate = function (models) {
    // associations can be defined here
  };
  return product_review_file_upload;
};
