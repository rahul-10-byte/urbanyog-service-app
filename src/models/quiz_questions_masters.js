"use strict";
module.exports = (sequelize, DataTypes) => {
  const quiz_questions_masters = sequelize.define(
    "quiz_questions_masters",
    {
        question_id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
          },
          quiz_id: DataTypes.INTEGER,
          question: DataTypes.STRING,
          option_1: DataTypes.STRING,
          option_2: DataTypes.STRING,
          option_3: DataTypes.STRING,
          option_4: DataTypes.STRING,
          answer: DataTypes.STRING,
          created_at: DataTypes.STRING,
          updated_at: DataTypes.STRING,
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );
  quiz_questions_masters.associate = function (models) {
    // associations can be defined here
  };
  return quiz_questions_masters;
};