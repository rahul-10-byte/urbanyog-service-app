"use strict";
module.exports = (sequelize, DataTypes) => {
  const third_party_product_review = sequelize.define(
    "third_party_product_review",
    {
      tp_review_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      tp_id: DataTypes.INTEGER,
      pid: DataTypes.INTEGER,
      tpm_product_url: DataTypes.STRING,
      created_at: DataTypes.STRING,
      updated_at: DataTypes.STRING,
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );
  third_party_product_review.associate = function (models) {
    // associations can be defined here
  };
  return third_party_product_review;
};
