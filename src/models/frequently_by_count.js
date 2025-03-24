"use strict";
module.exports = (sequelize, DataTypes) => {
  const frequently_by_count = sequelize.define(
    "frequently_by_count",
    {
      fbc_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      pid: DataTypes.INTEGER,
      page_url: DataTypes.STRING,
      page_type: DataTypes.STRING,
      click_count: DataTypes.INTEGER,
      created_at: DataTypes.STRING,
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );
  frequently_by_count.associate = function (models) {
    // associations can be defined here
  };
  return frequently_by_count;
};
