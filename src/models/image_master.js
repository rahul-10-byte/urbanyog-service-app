"use strict";
module.exports = (sequelize, DataTypes) => {
  const image_master = sequelize.define(
    "image_master",
    {
        image_id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        pid: DataTypes.INTEGER,
        type: DataTypes.STRING,
        url: DataTypes.STRING,
        size: DataTypes.STRING,
        created_at: DataTypes.STRING,
        updated_at: DataTypes.STRING,
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );
  image_master.associate = function (models) {
    // associations can be defined here
  };
  return image_master;
};
