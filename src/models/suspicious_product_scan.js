'use strict';
module.exports = (sequelize, DataTypes) => {
    const suspicious_product_scan = sequelize.define('suspicious_product_scan', {
        suspicious_scan_id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        qr_code: DataTypes.STRING,
        first_name: DataTypes.STRING,
        last_name: DataTypes.STRING,
        cust_email: DataTypes.STRING,
        comment: DataTypes.STRING,
        contact_no: DataTypes.INTEGER,
        product_buy_from: DataTypes.INTEGER,
        created_at: DataTypes.STRING,
        updated_at: DataTypes.STRING,
    }, {
        freezeTableName: true,
        timestamps: false
    });
    suspicious_product_scan.associate = function (models) {
        // associations can be defined here
    };
    return suspicious_product_scan;
};
