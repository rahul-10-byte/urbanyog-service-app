
"use strict";
module.exports = (sequelize, DataTypes) => {
  const game_masters = sequelize.define(
    "game_masters",
    {
        game_id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
          },
          game_name: DataTypes.STRING,
          game_type: DataTypes.STRING,
          played_by: DataTypes.INTEGER,
          created_at: DataTypes.STRING,
          updated_at: DataTypes.STRING,
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );
  game_masters.associate = function (models) {
    // associations can be defined here
  };
  return game_masters;
};
