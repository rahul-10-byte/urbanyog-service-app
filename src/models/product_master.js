"use strict";
module.exports = (sequelize, DataTypes) => {
  const product_master = sequelize.define(
    "product_master",
    {
      pid: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      product_id: DataTypes.INTEGER,
      product_name: DataTypes.STRING,
      product_handle: DataTypes.STRING,
      product_category: DataTypes.STRING,
      product_img_url: DataTypes.STRING,
      store_name: DataTypes.STRING,
      created_at: DataTypes.STRING,
      updated_at: DataTypes.STRING,
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );

  product_master.associate = function (models) {
    // Define association with qr_master
    product_master.hasMany(models.qr_master, {
      foreignKey: "pid",
      sourceKey: "pid",
    });

    // 🔹 Define association with cust_qr_scan_order
    product_master.hasMany(models.cust_qr_scan_order, {
      foreignKey: "bought_product_pid",
      sourceKey: "pid",
      
    });
  };

  return product_master;
};
