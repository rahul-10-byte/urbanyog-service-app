module.exports = (sequelize, DataTypes) => {
  const authToken_master = sequelize.define(
    "authToken_master",
    {
      user_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },

      auth_token: {
        allowNull: false,
        type: DataTypes.STRING,
        primaryKey: true,
      },
      expires_in: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );
  authToken_master.associate = function (models) {
    // associations can be defined here
  };
  return authToken_master;
};
