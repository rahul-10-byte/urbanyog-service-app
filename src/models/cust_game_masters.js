
"use strict";
module.exports = (sequelize, DataTypes) => {
  const cust_game_masters = sequelize.define(
    "cust_game_masters",
    {
        cust_g_id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
          },
          cust_g_name: DataTypes.STRING,
          cust_g_phone_no: DataTypes.INTEGER,
          cust_g_email: DataTypes.STRING,
          quiz_id: DataTypes.INTEGER,
          question_id: DataTypes.INTEGER,
          result: DataTypes.INTEGER,
          discount_code: DataTypes.STRING,
          created_at: DataTypes.STRING,
          updated_at: DataTypes.STRING,
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );
  cust_game_masters.associate = function (models) {
    // associations can be defined here
  };
  return cust_game_masters;
};
