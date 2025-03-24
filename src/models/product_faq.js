"use strict";
module.exports = (sequelize, DataTypes) => {
  const product_faq = sequelize.define(
    "product_faq",
    {
      faq_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      pid: DataTypes.INTEGER,
      question: DataTypes.STRING,
      answer: DataTypes.STRING,
      created_at: DataTypes.STRING,
      updated_at: DataTypes.STRING,
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );
  product_faq.associate = function (models) {
    // associations can be defined here
  };
  return product_faq;
};
