module.exports = (sequelize, DataTypes) => {
  const user_master = sequelize.define(
    "user_master",
    {
      user_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      email: DataTypes.STRING,
      contact_no: DataTypes.STRING,
      password: DataTypes.STRING,
      status: DataTypes.STRING,
      created_at: DataTypes.STRING,
      updated_at: DataTypes.STRING,
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );
  user_master.associate = function (models) {
    // associations can be defined here
  };
  return user_master;
};
