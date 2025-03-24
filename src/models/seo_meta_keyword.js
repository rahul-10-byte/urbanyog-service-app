"use strict";
module.exports = (sequelize, DataTypes) => {
  const seo_meta_keyword = sequelize.define(
    "seo_meta_keyword",
    {
      keyword_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      pid: DataTypes.INTEGER,
      keyword: DataTypes.STRING,
      status: DataTypes.INTEGER,
      created_at: DataTypes.STRING,
      updated_at: DataTypes.STRING,
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );
  seo_meta_keyword.associate = function (models) {
    // associations can be defined here
  };
  return seo_meta_keyword;
};
