const Joi = require('joi');
// const jwt = require('jsonwebtoken');
const config = require('../config/config.json');
const ProductScanVerificationService = require('../service/productscanverificationservice');
const productscanverificationservice = new ProductScanVerificationService();
const excel = require("exceljs");

exports.verifyProduct = (req, res) => {
    const data = req.body;
    const schema = Joi.object().keys({
        qrId: Joi.string().required().error(new Error('Provide qrId(string)')),
        firstName: Joi.string().required().error(new Error('Provide firstName(String)')),
        lastName: Joi.string().required().error(new Error('Provide lastName(String)')),
        custEmail: Joi.string().required().error(new Error('Provide custEmail(String)')),
        contactNo: Joi.number().required().error(new Error('Provide contactNo(number)')),
        productBuyFrom: Joi.number().required().error(new Error('Provide productBuyFrom(number)')),
        limit: Joi.number().error(new Error('Provide limit(number)')),
        offset: Joi.number().error(new Error('Provide offset(number)'))
    });

    const { error, value } = schema.validate(data);  // Updated

    if (error) {
        res.status(422).json({
            statusCode: 422,
            status: 'error',
            message: 'Invalid request data',
            data: error.message
        });
    } else {
        productscanverificationservice.verifyProduct(req, res)
            .then(data => {
                if (data) {
                    res.status(200).send({
                        statusCode: data.status_code,
                        status: true,
                        message: data.message,
                        data: data
                    });
                } else {
                    res.status(200).send({
                        statusCode: data.status_code,
                        status: false,
                        message: 'Something Wrong !!!',
                        data: data
                    });
                }
            })
            .catch(err => {
                console.log(err);
                res.status(400).send({
                    statusCode: 101,
                    status: false,
                    message: "Something Wrong !!!",
                    data: err
                });
            });
    }
};

exports.getSuspiciousVerification = (req, res) => {
    const data = req.body;
    const schema = Joi.object().keys({
        qrId: Joi.number().error(new Error('Provide qrId(number)')),
        firstName: Joi.string().error(new Error('Provide firstName(String)')),
        lastName: Joi.string().error(new Error('Provide lastName(String)')),
        custEmail: Joi.string().error(new Error('Provide custEmail(String)')),
        contactNo: Joi.number().error(new Error('Provide contactNo(number)')),
        limit: Joi.number().error(new Error('Provide limit(number)')),
        offset: Joi.number().error(new Error('Provide offset(number)'))
    });

    const { error, value } = schema.validate(data);  // Updated

    if (error) {
        res.status(422).json({
            statusCode: 422,
            status: 'error',
            message: 'Invalid request data',
            data: error.message
        });
    } else {
        productscanverificationservice.getSuspiciousVerification(req, res)
            .then(data => {
                if (data.count > 0) {
                    res.status(200).send({
                        statusCode: 100,
                        status: true,
                        message: 'Suspicious Product QR Code Scan Details',
                        data: data
                    });
                } else {
                    res.status(200).send({
                        statusCode: 101,
                        status: false,
                        message: 'Suspicious Product QR Code Scan Details Not Found',
                        data: data
                    });
                }
            })
            .catch(err => {
                res.status(200).send({
                    statusCode: 101,
                    status: false,
                    message: err,
                    data: []
                });
            });
    }
};


exports.getProductVerification = (req, res) => {
    const data = req.body;
    const schema = Joi.object().keys({
        qrId: Joi.number().error(new Error('Provide qrId(number)')),
        firstName: Joi.string().error(new Error('Provide firstName(String)')),
        lastName: Joi.string().error(new Error('Provide lastName(String)')),
        custEmail: Joi.string().error(new Error('Provide custEmail(String)')),
        contactNo: Joi.number().error(new Error('Provide contactNo(number)')),
        qrCode: Joi.string().error(new Error('Provide qrCode(string)')),
        tpmId: Joi.number().error(new Error('Provide tpmId(number)')),
        limit: Joi.number().error(new Error('Provide limit(number)')),
        offset: Joi.number().error(new Error('Provide offset(number)'))
    });
    const { error, value } = schema.validate(data);  // Updated
    ``
    if (error) {
        // send a 422 error response if validation fails
        res.status(422).json({
            statusCode: 422,
            status: 'error',
            message: 'Invalid request data',
            data: error.message
        });
    } else {
        productscanverificationservice.getProductVerification(req, res).then(data => {
            if (data.count > 0) {
                res.status(200).send({
                    statusCode: 100,
                    status: true,
                    message: 'Product QR Code Scan',
                    data: data
                })
            } else {
                res.status(200).send({
                    statusCode: 101,
                    status: false,
                    message: 'Data not found',
                    data: data
                })
            }
        })
            .catch(err => {
                res.status(200).send({
                    statusCode: 101,
                    status: false,
                    message: err,
                    data: []
                })
            })
    }

}

exports.getQRCodeDetails = (req, res) => {
    const data = req.body;
    const schema = Joi.object().keys({
        qrId: Joi.string().error(new Error('Provide qrId(number)')),
        PId: Joi.number().error(new Error('Provide PId(number)')),
        variantId: Joi.number().error(new Error('Provide variantId(number)')),
        status: Joi.number().error(new Error('Provide status(number)')),
    });
    const { error, value } = schema.validate(data);  // Updated
    if (error) {
        // send a 422 error response if validation fails
        res.status(422).json({
            statusCode: 422,
            status: 'error',
            message: 'Invalid request data',
            data: error.message
        });
    } else {
        productscanverificationservice.getQRCodeDetails(req, res).then(data => {
            if (data.count > 0) {
                res.status(200).send({
                    statusCode: 100,
                    status: true,
                    message: 'QR Codes',
                    data: data
                })
            } else {
                res.status(200).send({
                    statusCode: 101,
                    status: false,
                    message: 'QR Code not found',
                    data: data
                })
            }
        })
            .catch(err => {
                res.status(200).send({
                    statusCode: 101,
                    status: false,
                    message: err,
                    data: []
                })
            })
    }
}

exports.downloadQRScanCSV = (req, res) => {
    const data = req.body;
    const schema = Joi.object().keys({
        qrId: Joi.number().error(new Error('Provide qrId(number)')),
        PId: Joi.number().error(new Error('Provide PId(number)')),
        variantId: Joi.number().error(new Error('Provide variantId(number)')),
        status: Joi.number().error(new Error('Provide status(number)')),
    });
    const { error, value } = schema.validate(data);  // Updated
    if (error) {
        // send a 422 error response if validation fails
        res.status(422).json({
            statusCode: 422,
            status: 'error',
            message: 'Invalid request data',
            data: error.message
        });
    } else {
        productscanverificationservice.downloadQRScanCSV(req, res).then(data => {
            let d = new Date();
            let date = d.getTime();
            if (data.length > 0) {
                try {
                    let scanData = [];

                    data.forEach((obj) => {
                        scanData.push({
                            "QR Code": obj.qrCode,
                            "Customer Name": obj.customerName,
                            "Customer Email": obj.custEmail,
                            "Contact No": obj.contactNo,
                            "Product Name": obj.productName,
                            "Scanned Date": obj.createdAt
                        });
                    });

                    let workbook = new excel.Workbook();
                    let worksheet = workbook.addWorksheet("QR Scan");

                    // headerStyle = {
                    //     font: {
                    //         name: 'Arial Black',
                    //         color: { argb: 'FF00FF00' },
                    //         family: 2,
                    //         size: 14,
                    //         italic: true
                    //     }
                    // }
                    worksheet.columns = [
                        { header: "QR Code", key: "QR Code", width: 10 },
                        { header: "Customer Name", key: "Customer Name", width: 20 },
                        { header: "Customer Email", key: "Customer Email", width: 30 },
                        { header: "Contact No", key: "Contact No", width: 20 },
                        { header: "Product Name", key: "Product Name", width: 30 },
                        { header: "Scanned Date", key: "Scanned Date", width: 20 }
                    ];
                    let headerStyle = {
                        type: 'pattern',
                        pattern: 'darkTrellis',
                        font: { size: 14 },
                        fgColor: { argb: 'FFFFFF00' },
                        bgColor: { argb: 'FF5733' }
                    };

                    let fontStyle = { size: 14, bold: true };

                    worksheet.getRow(1).fill = headerStyle;
                    worksheet.getRow(1).font = fontStyle;

                    // Add Array Rows
                    worksheet.addRows(scanData);

                    res.setHeader(
                        "Content-Type",
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    );
                    res.setHeader(
                        "Content-Disposition",
                        "attachment; filename=" + "QR Scanned Report" + date + ".xlsx"
                    );

                    return workbook.xlsx.write(res).then(function () {
                        res.status(200).end();
                    });

                } catch (err) {
                    console.error('OOOOOOO this is the error: ' + err);
                }
            } else {
                res.status(200).send({
                    statusCode: 101,
                    status: false,
                    message: 'QR Code not found',
                    data: data
                })
            }
        })
            .catch(err => {
                res.status(200).send({
                    statusCode: 101,
                    status: false,
                    message: err,
                    data: []
                })
            })
    }

}