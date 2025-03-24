'use strict';
module.exports = (sequelize, DataTypes) => {
    const product_scan = sequelize.define('product_scan', {
        scan_id : {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        qr_code: DataTypes.STRING,
        first_name: DataTypes.STRING,
        last_name: DataTypes.STRING,
        cust_email: DataTypes.STRING,
        contact_no: DataTypes.INTEGER,
        product_buy_from: DataTypes.INTEGER,
        created_at: DataTypes.STRING,
        updated_at: DataTypes.STRING,
    }, {
        freezeTableName: true,
        timestamps: false
    });
    product_scan.associate = function (models) {
        // associations can be defined here
    };
    return product_scan;
};
