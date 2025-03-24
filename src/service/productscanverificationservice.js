const QRMaster = require('../models').qr_master;
const ProductScan = require('../models').product_scan;
const SuspiciousProductScan = require('../models').suspicious_product_scan;
const Productmaster = require("../models").product_master;
const ProductFAQ = require("../models").product_faq;
const cust_qr_scan_order = require("../models").cust_qr_scan_order
const ProductSuggestion = require("../models").product_suggestion;
const Productvariant = require("../models").product_variant_master;
const ProductVideo = require("../models").product_video;
const TPMProductReviewURL = require("../models").third_party_product_review;
const ProductReview = require("../models").product_review;
const TPMaster = require("../models").third_party_master;

const shopifyCustomerHelper = require("../helpers/shopifyCustomerHelper");
const customerHelper = new shopifyCustomerHelper();

const Op = require('sequelize').Op

class ProductScanVerificationService {

    verifyProduct(req, res) {

    return new Promise((resolve, reject) => {
      var date = new Date();
      var dateStr =
        date.getFullYear() +
        "-" +
        ("00" + (date.getMonth() + 1)).slice(-2) +
        "-" +
        ("00" + date.getDate()).slice(-2) +
        " " +
        ("00" + date.getHours()).slice(-2) +
        ":" +
        ("00" + date.getMinutes()).slice(-2) +
        ":" +
        ("00" + date.getSeconds()).slice(-2);

      let where = {};
      let scanwhere = {};
      let data = {};

      if (req.body.qrId) {

        let qrID = req.body.qrId;
        where.qr_code = qrID;

        data.status = 1;
        data.updated_at = dateStr;

        return QRMaster.findOne({
          where: where,
          attributes: ['qr_id', 'qr_code', 'pid']
        }).then((result) => {

          if (result) {

            var pID = result.dataValues.pid;
            let wherefaq = {};
            wherefaq.pid = pID;
            let resNewObj = [];

            let finalResultObj = {};
            let resFinalObj = [];

            let finalProductObj = {};

            finalProductObj.sugestion_title = "Product Details";
            finalProductObj.data = pID;
            resFinalObj.push(finalProductObj);

            ProductFAQ.findAndCountAll({
              where: wherefaq,
              attributes: ['faq_id', 'question', 'answer']
            }).then((result) => {

              result.rows.forEach(function (item, index, result) {
                let resultObj = {};
                resultObj.question = result[index].dataValues.question;
                resultObj.answer = result[index].dataValues.answer;
                resNewObj.push(resultObj);

              });


              finalResultObj.sugestion_title = "FAQ";
              finalResultObj.data = resNewObj;

            })
              .catch(error => reject(error));
            resFinalObj.push(finalResultObj);

            let resNewVideoObj = [];
            let finalVideoResultObj = {};

            ProductVideo.findAndCountAll({
              where: wherefaq,
              attributes: ['video_id', 'pid', 'video_url']
            }).then((result) => {

              result.rows.forEach(function (item, index, result) {

                let resultVideoObj = {};

                resultVideoObj.pid = result[index].dataValues.pid;
                resultVideoObj.video_url = result[index].dataValues.video_url;
                resNewVideoObj.push(resultVideoObj);

              });

              finalVideoResultObj.sugestion_title = "Suggested Video";
              finalVideoResultObj.data = resNewVideoObj;

            })
              .catch(error => reject(error));
            resFinalObj.push(finalVideoResultObj);

            let rescust_qr_scan_orderReqObj = [];
            let finalcust_qr_scan_orderResultObj = {};
            
            cust_qr_scan_order.findAndCountAll({
              where: {
                cust_email: req.body.custEmail,
                cust_number: req.body.contactNo
              }
            }).then((result) => {
                finalcust_qr_scan_orderResultObj.sugestion_title = "Customer QR Scanned Data";
                finalcust_qr_scan_orderResultObj.data = result;

            })
              .catch(error => reject(error));
            resFinalObj.push(finalcust_qr_scan_orderResultObj);

            let resNewProductObj = [];
            let finalProductResultObj = {};

            ProductSuggestion.findAndCountAll({
              where: wherefaq,
              attributes: ['pid', 'suggst_pid', 'suggst_product_id']
            }).then((result) => {

              result.rows.forEach(function (item, index, result) {

                let resultProductObj = {};

                resultProductObj.pid = result[index].dataValues.pid;
                resultProductObj.suggst_pid = result[index].dataValues.suggst_pid;
                resultProductObj.suggst_product_id = result[index].dataValues.suggst_product_id;
                resNewProductObj.push(resultProductObj);

              });

              finalProductResultObj.sugestion_title = "Suggested Products";
              finalProductResultObj.data = resNewProductObj;

            })
              .catch(error => reject(error));
            resFinalObj.push(finalProductResultObj);

            let resNewReviewObj = [];
            let finalReviewResultObj = {};

            TPMProductReviewURL.findAndCountAll({
              where: wherefaq,
              attributes: ['tp_id', 'pid', 'tpm_product_url']
            }).then((result) => {

              result.rows.forEach(function (item, index, result) {

                let resultReviewObj = {};

                resultReviewObj.pid = result[index].dataValues.pid;
                resultReviewObj.tp_id = result[index].dataValues.tp_id;
                resultReviewObj.tpm_product_url = result[index].dataValues.tpm_product_url;
                resNewReviewObj.push(resultReviewObj);

              });

              finalReviewResultObj.sugestion_title = "Website Product Review";
              finalReviewResultObj.data = resNewReviewObj;

            })
              .catch(error => reject(error));
            resFinalObj.push(finalReviewResultObj);

            let resNewProductReviewObj = [];
            let finalProductReviewResultObj = {};

            ProductReview.findAndCountAll({
              where: wherefaq,
              attributes: ['pid', 'review', 'star_count', 'cust_name', 'cust_email']
            }).then((result) => {

              result.rows.forEach(function (item, index, result) {

                let resultProductReviewObj = {};

                resultProductReviewObj.pid = result[index].dataValues.pid;
                resultProductReviewObj.review = result[index].dataValues.review;
                resultProductReviewObj.star_count = result[index].dataValues.star_count;
                resultProductReviewObj.cust_name = result[index].dataValues.cust_name;
                resultProductReviewObj.cust_email = result[index].dataValues.cust_email;
                resNewProductReviewObj.push(resultProductReviewObj);

              });

              finalProductReviewResultObj.sugestion_title = "Product Reviews";
              finalProductReviewResultObj.data = resNewProductReviewObj;

            })
              .catch(error => reject(error));
            resFinalObj.push(finalProductReviewResultObj);

            let wherechk = {};
            wherechk.cust_email = req.body.custEmail;
            wherechk.contact_no = req.body.contactNo;;
            wherechk.product_buy_from = req.body.productBuyFrom;

            ProductScan.findOne({
              where: wherechk,
              attributes: ['qr_code']
            }).then((resultfind) => {

              if (resultfind) {


                let wherechkqr = {};
                wherechkqr.qr_code = resultfind.dataValues.qr_code;

                QRMaster.findOne({
                  where: wherechkqr,
                  attributes: ['qr_code', 'pid']
                }).then((resultfind) => {

                  if (resultfind) {

                    if (pID == resultfind.dataValues.pid) {
                      let errResp = {
                        status_code: 104,
                        message: 'Your Product Is Genuine. Thank You !',
                        data: resFinalObj
                      }
                      resolve(errResp);

                    }
                  }
                })
                  .catch(error => reject(error));
              }
            })
              .catch(error => reject(error));

            return QRMaster.update(data, {
              where: where
            }).then(result => {


              where.qr_code = qrID;
              where.cust_email = req.body.custEmail;

              return ProductScan.findOne({
                where: where,
                attributes: ['cust_email']
              }).then(resultscan => {

                if (resultscan) {

                  let errResp = {
                    status_code: 101,
                    message: 'You Have Already Scanned QR Code!',
                    data: resFinalObj
                  }
                  resolve(errResp);

                } else {

                  return ProductScan.findOne({
                    where: {
                      qr_code: qrID,
                      cust_email: { [Op.not]: req.body.custEmail }
                    },
                    attributes: ['cust_email', 'qr_code']
                  }).then(resultscan => {
                    if (resultscan) {

                      let where = [];

                      let cnd = {
                        where: {
                          qr_code: resultscan.dataValues.qr_code,
                          first_name: req.body.firstName,
                          last_name: req.body.lastName,
                          cust_email: req.body.custEmail,
                          contact_no: req.body.contactNo,
                        }
                      }

                      return SuspiciousProductScan.findAll(cnd).then((resultsusp) => {

                        if (resultsusp.length <= 0) {

                          return SuspiciousProductScan.create({
                            qr_code: resultscan.dataValues.qr_code,
                            first_name: req.body.firstName,
                            last_name: req.body.lastName,
                            cust_email: req.body.custEmail,
                            comment: "Customer scanning the QR COde which is already scanned",
                            contact_no: req.body.contactNo,
                            product_buy_from: req.body.productBuyFrom,
                            created_at: dateStr
                          }).then(resultsubmit => {
                            this.createCustomer(req.body.firstName, req.body.lastName, req.body.custEmail, req.body.contactNo)
                            let errResp = {
                              status_code: 100,
                              message: 'Your Product Is Genuine. Thank You !',
                              data: resultsubmit
                            }
                            resolve(errResp);
                          })
                            .catch(error => {
                              console.log(error);
                              reject(error)
                            });

                        } else {
                          let errResp = {
                            status_code: 100,
                            message: 'Your Product Is Genuine. Thank You !',
                            data: resultsusp
                          }
                          resolve(errResp);
                        }

                      })
                        .catch(error => resolve(error));

                    } else {

                      return ProductScan.create({

                        qr_code: qrID,
                        first_name: req.body.firstName,
                        last_name: req.body.lastName,
                        cust_email: req.body.custEmail,
                        contact_no: req.body.contactNo,
                        product_buy_from: req.body.productBuyFrom,
                        created_at: dateStr

                      }).then(resultsubmit => {

                        this.createCustomer(req.body.firstName, req.body.lastName, req.body.custEmail, req.body.contactNo)

                        finalProductReviewResultObj.sugestion_title = "Product Scan Data. ";
                        finalProductReviewResultObj.data = resultsubmit;

                        resFinalObj.push(finalProductReviewResultObj);

                        let errResp = {
                          status_code: 100,
                          message: 'Your Product Is Genuine. Thank You !',
                          data: resFinalObj
                        }
                        resolve(errResp);
                      })
                        .catch(error => reject(error));
                    }
                  }).catch(error => reject(error));
                }
              }).catch(error => reject(error));

            }).catch(error => reject(error));


          } else {
            let errResp = {
              status_code: 102,
              message: 'Opps! Wrong QR Code Scanned, Please Try Again With Another Code.',
              data: []
            }
            resolve(errResp);
          }
        })
          .catch(error => reject(error));
      }
    })
      .catch(err => {
        return (err.message)
      })
  }


  getSuspiciousVerification(req, res) {
    return new Promise((resolve, reject) => {
      let where = {};

      if (req.body.qrId) {
        where.qr_id = req.body.qrId;
      }

      if (req.body.firstName) {
        where.first_name = { [Op.like]: `%${req.body.firstName}%` };
      }

      if (req.body.lastName) {
        where.last_name = { [Op.like]: `%${req.body.lastName}%` };
      }

      if (req.body.custEmail) {
        where.cust_email = { [Op.like]: `%${req.body.custEmail}%` };
      }

      if (req.body.contactNo) {
        where.contact_no = req.body.contactNo;
      }

      SuspiciousProductScan.belongsTo(QRMaster, {
        foreignKey: "qr_code", targetKey: "qr_code"
      });

      QRMaster.belongsTo(Productmaster, {
        foreignKey: "pid",
      });

      return SuspiciousProductScan.findAndCountAll({
        where: where,
        offset: req.body.offset || 0,
        limit: req.body.limit || 50,
        order: [["created_at", "DESC"]],
        attributes: [
          "suspicious_scan_id",
          "qr_code",
          "first_name",
          "last_name",
          "cust_email",
          "comment",
          "contact_no",
          "created_at",
          "updated_at",
        ],
        include: [
          {
            model: QRMaster,
            required: true,
            attributes: [
              "pid",
              "variant_id"
            ],
            include: [
              {
                model: Productmaster,
                required: true,
                attributes: [
                  "pid",
                  "product_name",
                  "product_category",
                  "product_img_url"
                ],
              },
            ],
          },
        ],
      })
        .then((result) => {
          resolve(result);
        })
        .catch((error) => reject(error));
    }).catch((err) => {
      return err;
    });
  }


  getProductVerification(req, res) {
    return new Promise((resolve, reject) => {
      let where = {};

      if (req.body.qrId) {
        where.qr_id = req.body.qrId;
      }

      if (req.body.firstName) {
        where.first_name = { [Op.like]: `%${req.body.firstName}%` };
      }

      if (req.body.lastName) {
        where.last_name = { [Op.like]: `%${req.body.lastName}%` };
      }

      if (req.body.custEmail) {
        where.cust_email = { [Op.like]: `%${req.body.custEmail}%` };
      }

      if (req.body.contactNo) {
        where.contact_no = req.body.contactNo;
      }

      if (req.body.qrCode) {
        where.qr_code = req.body.qrCode;
      }

      if (req.body.tpmId) {
        where.product_buy_from = req.body.tpmId;
      }

      ProductScan.belongsTo(QRMaster, {
        foreignKey: "qr_code", targetKey: 'qr_code'
      });

      QRMaster.belongsTo(Productmaster, {
        foreignKey: "pid",
      });

      ProductScan.belongsTo(TPMaster, {
        foreignKey: "product_buy_from", targetKey: 'tp_id'
      });

      return ProductScan.count({
        where: where,
        offset: req.body.offset || 0,
        limit: req.body.limit || 50,
        // include: [
        //   {
        //     model: QRMaster,
        //     required: true,
        //     include: [
        //       {
        //         model: Productmaster,
        //         required: true,
        //       },
        //     ]
        //   },
        //   {
        //     model: TPMaster,
        //     required: true,
        //   },
        // ],
      })
        .then((rowCount) => {
          return ProductScan.findAll({
            where: where,
            offset: req.body.offset || 0,
            limit: req.body.limit || 50,
            order: [["created_at", "DESC"]],
            attributes: [
              "scan_id",
              "qr_code",
              "first_name",
              "last_name",
              "cust_email",
              "contact_no",
              "created_at",
              "updated_at",
            ],
            include: [
              {
                model: QRMaster,
                required: true,
                attributes: [
                  "pid",
                  "variant_id",
                  "created_at",
                  "updated_at"
                ],
                include: [
                  {
                    model: Productmaster,
                    required: true,
                    attributes: [
                      "pid",
                      "product_name",
                      "product_category",
                      "product_img_url"
                    ],
                  },
                ]
              },
              {
                model: TPMaster,
                required: true,
                attributes: [
                  "tp_id",
                  "tp_name"
                ],
              },
            ],
          })
            .then((result) => {
              let data = {};
              data.count = rowCount;
              data.rows = result;
              resolve(data);
            })
            .catch((error) => {
              console.log(error);
              reject(error)
            });
        })
        .catch((error) => {
          console.log(error);
        });


    }).catch((err) => {
      return err;
    });
  }

  getQRCodeDetails(req, res) {
    return new Promise((resolve, reject) => {
      let where = {};

      if (req.body.qrId) {
        where.qr_id = req.body.qrId;
      }

      if (req.body.PId) {
        where.pid = req.body.PId;
      }

      if (req.body.variantId) {
        where.variant_id = req.body.variantId;
      }

      if (req.body.status) {
        where.status = req.body.status;
      }

      QRMaster.belongsTo(Productvariant, { foreignKey: 'variant_id', targetKey: 'variant_id' })
      QRMaster.belongsTo(Productmaster, { foreignKey: 'pid', targetKey: 'pid' })

      return QRMaster.findAndCountAll({
        where: where,
        offset: req.body.offset || 0,
        limit: req.body.limit || 50,
        attributes: [
          "qr_id",
          "qr_code",
          "pid",
          "variant_id",
          "status",
          "created_at",
          "updated_at",
        ],
        include: [{
          model: Productmaster,
          required: true,
          attributes: ['product_name']
        },
        {
          model: Productvariant,
          required: true,
          attributes: ['weight', 'selling_price', 'base_price']
        }]
      }).then(result => {
        let resultArr = result.rows
        let returData = resultArr.map(data => {
          let resultObj = {};
          resultObj.qr_id = data.dataValues.qr_id;
          resultObj.pid = data.dataValues.pid;
          resultObj.variant_id = data.dataValues.variant_id;
          resultObj.status = data.dataValues.status;
          resultObj.created_at = data.dataValues.created_at;
          resultObj.updated_at = data.dataValues.updated_at;
          resultObj.product_name = data.dataValues.product_master.product_name;
          resultObj.weight = data.dataValues.product_variant_master.weight;
          resultObj.selling_price = data.dataValues.product_variant_master.selling_price;
          resultObj.base_price = data.dataValues.product_variant_master.base_price;
          return resultObj;
        })
        let resObj = {
          count: result.count,
          rows: returData
        }
        resolve(resObj);
      }).catch((error) => reject(error));
    }).catch((err) => {
      return err;
    });
  }

  createCustomer(firstName, lastName, email, phone) {
    try {
      customerHelper
        .addCustomersToShopify(firstName, lastName, email, phone)
        .then((data) => {
          if (data.statusCode == 100) {
            console.log(data);
          } else {
            console.log(data);
          }
        })
        .catch((err) => {
          res.status(200).send({
            statusCode: 103,
            status: false,
            message: err,
            data: data,
          });
        });

    } catch (error) {
      console.log(error);
    }
  }

  downloadQRScanCSV(req, res) {
    return new Promise((resolve, reject) => {

      ProductScan.belongsTo(QRMaster, {
        foreignKey: "qr_code", targetKey: 'qr_code'
      });

      QRMaster.belongsTo(Productmaster, {
        foreignKey: "pid",
      });

      return ProductScan.findAndCountAll({
        // where: where,
        // offset: req.body.offset || 0,
        // limit: req.body.limit || 50,
        order: [["created_at", "DESC"]],
        attributes: [
          "qr_code",
          "first_name",
          "last_name",
          "cust_email",
          "contact_no",
          "created_at",
        ],
        include: [
          {
            model: QRMaster,
            required: true,
            attributes: [
              "pid",
              "variant_id"
            ],
            include: [
              {
                model: Productmaster,
                required: true,
                attributes: [
                  "pid",
                  "product_name",
                  "product_category",
                  "product_img_url"
                ],
              },
            ],
          },
        ],
      })
        .then((result) => {
          let scanArr = [];

          if (result.count > 0) {
            result.rows.map(data => {
              let obj = {};
              obj.qrCode = data.dataValues.qr_code;
              obj.customerName = data.dataValues.first_name + " " + data.dataValues.last_name;
              obj.custEmail = data.dataValues.cust_email;
              obj.contactNo = data.dataValues.contact_no;
              obj.createdAt = data.dataValues.created_at;
              obj.productName = data.dataValues.qr_master.product_master.product_name;
              scanArr.push(obj);
            })
            resolve(scanArr);
          } else {
            resolve(scanArr);
          }

        })
        .catch((error) => reject(error));
    }).catch((err) => {
      return err;
    });
  }
}

module.exports = ProductScanVerificationService;