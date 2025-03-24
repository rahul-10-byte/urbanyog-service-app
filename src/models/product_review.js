"use strict";

module.exports = (sequelize, DataTypes) => {
  const product_review = sequelize.define(
    "product_review",
    {
      review_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      pid: DataTypes.INTEGER,
      review: DataTypes.STRING,
      review_title: DataTypes.STRING,
      star_count: DataTypes.INTEGER,
      cust_name: DataTypes.STRING,
      cust_email: DataTypes.STRING,
      cust_location: DataTypes.STRING,
      admin_reply: DataTypes.STRING,
      status: DataTypes.INTEGER,
      shopify_cust_id: DataTypes.INTEGER,
      created_at: DataTypes.STRING,
      updated_at: DataTypes.STRING,
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );

  product_review.associate = function (models) {
    // associations can be defined here
  };

  return product_review;
};
