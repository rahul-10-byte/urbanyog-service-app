"use strict";
module.exports = (sequelize, DataTypes) => {
  const product_video = sequelize.define(
    "product_video",
    {
      video_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      pid: DataTypes.INTEGER,
      video_url: DataTypes.STRING,
      video_type: DataTypes.STRING,
      created_at: DataTypes.STRING,
      updated_at: DataTypes.STRING,
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );
  product_video.associate = function (models) {
    // associations can be defined here
  };
  return product_video;
};
