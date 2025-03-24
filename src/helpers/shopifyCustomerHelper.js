const Customermaster = require("../models").customer_master;
const CustomerAddressMaster = require("../models").customer_address_master;
const Op = require("sequelize").Op;
const request = require("request");
const awaitEach = require("await-each");
const ShopifyCountryMaster = require("../models").shopify_country_master;
const ShopifyProvinceMaster = require("../models").shopify_province_master;

class CustomerHelper {
  getCustomersFromShopify(link) {
    return new Promise((resolve, reject) => {
      let shopUrl = process.env.shopifyStoreURL + "customers.json?limit=250";

      if (link) {
        shopUrl = link;
      }

      const auth =
        "Basic " +
        Buffer.from(
          process.env.shopifyApiKey + ":" + process.env.shopifyApiPassword
        ).toString("base64");

      const customerOptions = {
        url: shopUrl,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: auth,
        },
        // qs: {
        //   limit: 250,
        // },
      };

      request(customerOptions, (err, res, body) => {
        if (err) {
          reject(err);
          console.log("Done");
          return false;
        }

        if (body) {
          let result = JSON.parse(body);
          if (result.customers) {
            awaitEach(result.customers, async function (item) {
              await addCustomer(item);
            }).then(function (responses) {
              getNextLink(res.headers.link);
            });
          }
        } else {
          console.log("out------------", body);
          resolve(link);
        }
      });
    }).catch((err) => {
      if (err) {
        console.log(err);
        return err;
      }
    });
  }

  addCustomersToShopify(firstName, lastName, email, phone, res) {
    return new Promise((resolve, reject) => {
      let obj = {};
      let customer = {};
      if (firstName) {
        obj.first_name = firstName.trim();
      }

      if (lastName) {
        obj.last_name = lastName.trim();
      }

      if (email) {
        obj.email = email.trim();
        obj.send_email_invite = true;
        obj.accepts_marketing = true;
        obj.tags = "product_qr_scan";
      }

      if (phone) {
        obj.phone = phone.trim();
      }
      customer.customer = obj;
      let shopUrl = process.env.shopifyStoreURL + "customers.json";

      const auth =
        "Basic " +
        Buffer.from(
          process.env.shopifyApiKey + ":" + process.env.shopifyApiPassword
        ).toString("base64");

      const customerOptions = {
        url: shopUrl,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: auth,
        },
        body: customer,
        json: true,
      };

      request(customerOptions, (err, res, body) => {
        if (err) {
          reject(err);
        }
        if (body) {
          if (body.errors) {
            reject(body.errors);
          } else {
            resolve({
              statusCode: 100,
              message: "Account created successfully",
            });
          }
        } else {
          resolve([]);
        }
      });
    }).catch((err) => {
      if (err) {
        return err;
      }
    });
  }

  addCustAddressToShopify(req, res) {
    return new Promise((resolve, reject) => {
      let obj = {};
      let customer = {};

      return getCntryProvCode(req.body.countryName, req.body.province)
        .then((cntryProvData) => {
          if (cntryProvData) {
            let countryCode = cntryProvData.dataValues.country_code;
            let provinceCode =
              cntryProvData.dataValues.shopify_province_master.dataValues
                .province_code;

            if (req.body.shopifyCustomerId) {
              obj.address1 = req.body.address1;
              obj.address2 = req.body.address2;
              obj.city = req.body.city;
              obj.company = req.body.landMark;
              obj.first_name = req.body.first_name;
              obj.last_name = req.body.lastName;
              obj.phone = req.body.phone;
              obj.province = req.body.province;
              obj.country = req.body.country;
              obj.zip = req.body.zip;
              obj.name = req.body.firstName + " " + req.body.lastName;
              obj.provinceCode = provinceCode;
              obj.countryCode = countryCode;
              obj.countryName = req.body.countryName;
            } else {
              let data = { statusCode: 101 };
              return data;
            }

            customer.address = obj;

            let shopUrl =
              process.env.shopifyStoreURL +
              "customers/" +
              req.body.shopifyCustomerId +
              "/addresses.json";
            const auth =
              "Basic " +
              Buffer.from(
                process.env.shopifyApiKey + ":" + process.env.shopifyApiPassword
              ).toString("base64");

            const customerOptions = {
              url: shopUrl,
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: auth,
              },
              body: customer,
              json: true,
            };

            request(customerOptions, (err, res, body) => {
              if (err) {
                reject(err);
              }
              if (body) {
                if (body.errors) {
                  reject(body.errors);
                } else {
                  resolve(body);
                }
              } else {
                resolve([]);
              }
            });
          } else {
            let result = {
              statusCode: 101,
              status: false,
              message: "Failed add address",
              data: [],
            };
            reject(result);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }).catch((err) => {
      if (err) {
        return err;
      }
    });
  }

  deleteCustAddress(body) {
    return new Promise((resolve, reject) => {
      let shopUrl =
        process.env.shopifyStoreURL +
        "customers/" +
        body.shopifyCustomerId +
        "/addresses/" +
        body.shopifyAddressId +
        ".json";
      const auth =
        "Basic " +
        Buffer.from(
          process.env.shopifyApiKey + ":" + process.env.shopifyApiPassword
        ).toString("base64");
      const customerOptions = {
        url: shopUrl,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: auth,
        },
        // qs: {
        //   limit: 250,
        // },
      };

      request(customerOptions, (err, res, body) => {
        if (err) {
          reject(err);
          console.log("Done");
          return false;
        }

        if (body) {
          let result = JSON.parse(body);

          if (result.errors) {
            reject(result);
          } else {
            resolve(result);
          }
        } else {
          resolve([]);
        }
      });
    }).catch((err) => {
      if (err) {
        return err;
      }
    });
  }

  changeCustomerPassword(body) {
    console.log(body);
    return new Promise((resolve, reject) => {
      let shopUrl =
        process.env.shopifyStoreURL +
        "customers/" +
        body.shopifyCustomerId +
        ".json";
      shopUrl = shopUrl.trim();
      const auth =
        "Basic " +
        Buffer.from(
          process.env.shopifyApiKey + ":" + process.env.shopifyApiPassword
        ).toString("base64");

      let passData = {
        id: parseInt(body.shopifyCustomerId),
        password: body.password,
        password_confirmation: body.password,
        send_email_welcome: false,
      };
      console.log(passData);
      console.log(shopUrl);
      const customerOptions = {
        url: shopUrl,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: auth,
        },
        body: passData,
        json: true,
      };

      request(customerOptions, (err, res, body) => {
        let result = "";
        if (err) {
          reject(err);
          console.log("Done");
          return false;
        } else if (body) {
          if (typeof body === "object") result = body;
          // dont parse if its object
          else if (typeof userData === "string") result = JSON.parse(body);

          // let result = JSON.parse(body);
          console.log(result);
          if (result.errors) {
            reject(result);
          } else {
            resolve(result);
          }
        } else {
          resolve([]);
        }
      });
    }).catch((err) => {
      if (err) {
        return err;
      }
    });
  }
}

var custHelper = new CustomerHelper();

function getNextLink(str) {
  let timerId = "";
  if (str) {
    var n = str.search('rel="previous"');
    if (n > 0) {
      let link = str.split('rel="previous",')[1];
      if (link) {
        var test_str = link;
        var start_pos = test_str.indexOf("<") + 1;
        var end_pos = test_str.indexOf(`>; rel="next"`, start_pos);
        var text_to_get = test_str.substring(start_pos, end_pos);

        timerId = setTimeout(function () {
          custHelper.getCustomersFromShopify(text_to_get);
        }, 500);
      } else {
        let obj = {
          statusCode: 100,
          status: true,
          message: "Done",
        };
        custHelper.getCustomersFromShopify(obj);
      }
    } else {
      var test_str = str;
      var start_pos = test_str.indexOf("<") + 1;
      var end_pos = test_str.indexOf(`>; rel="next"`, start_pos);
      var text_to_get = test_str.substring(start_pos, end_pos);

      timerId = setTimeout(function () {
        custHelper.getCustomersFromShopify(text_to_get);
      }, 2000);
    }
  } else {
    clearTimeout(timerId);
    return "";
  }
}

function addCustomer(body) {
  // console.log(body);
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

  return new Promise((resolve, reject) => {
    let cnd = {
      where: {
        shopify_customer_id: body.id,
      },
    };
    let contact = "";

    if (body.default_address) {
      if (body.default_address.phone) {
        contact = body.default_address.phone.replace(" ", "");
      }
    }
    return Customermaster.findAll(cnd)
      .then((customerData) => {
        if (customerData.length <= 0) {
          return Customermaster.create({
            shopify_customer_id: Number(body.id),
            first_name: body.first_name,
            last_name: body.last_name,
            email: body.email,
            phone: contact,
            gender: "",
            dob: "",
            created_at: dateStr,
          })
            .then((newCustData) => {
              awaitEach(body.addresses, async function (item) {
                await addCustAdresses(item, newCustData);
              })
                .then(function (responses) {
                  resolve(responses);
                })
                .catch((err) => {
                  console.log(err);
                  reject(err);
                });
            })
            .catch((error) => {
              reject(error);
            });
        } else {
          return Customermaster.update(
            {
              first_name: body.first_name,
              last_name: body.last_name,
              email: body.email,
              phone: contact,
              updated_at: dateStr,
            },
            {
              where: {
                shopify_customer_id: Number(body.id),
              },
            }
          )
            .then((result) => {
              awaitEach(body.addresses, async function (item) {
                await addCustAdresses(item, customerData[0]);
              })
                .then(function (responses) {
                  resolve(responses);
                })
                .catch((err) => {
                  console.log(err);
                  reject(err);
                });
            })
            .catch((error) => {
              reject(error);
            });
        }
      })
      .catch((error) => {
        return error;
      });
  }).catch((err) => {
    console.log(err);
    return err.message;
  });
}

function addCustAdresses(custData, body) {
  // console.log('here====================');
  // console.log(custData);
  // console.log(body);

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

  return new Promise((resolve, reject) => {
    let custAddressCnd = {
      where: {
        store_cust_id: Number(body.dataValues.shopify_customer_id),
      },
    };

    return CustomerAddressMaster.findAll(custAddressCnd)
      .then((result) => {
        if (result.length <= 0) {
          return CustomerAddressMaster.create({
            store_address_id: custData.id,
            cust_id: body.dataValues.cust_id,
            store_cust_id: body.dataValues.shopify_customer_id,
            first_name: custData.first_name,
            last_name: custData.last_name,
            company: custData.company,
            address1: custData.address1,
            address2: custData.address2,
            city: custData.city,
            province: custData.province,
            country: custData.country,
            zip: custData.zip || 000000,
            phone: custData.phone ? custData.phone.trim() : 0000000000,
            name: custData.name,
            province_code: custData.province_code,
            country_code: custData.country_code,
            country_name: custData.country_name,
            default: custData.default,
            address_type: "Default",
            created_at: dateStr,
          })
            .then((custAddressAdded) => {
              resolve(custAddressAdded);
            })
            .catch((error) => {
              reject(error);
            });
        } else {
          //if address already present then update
          return CustomerAddressMaster.update(
            {
              store_address_id: custData.id,
              cust_id: body.dataValues.cust_id,
              first_name: custData.first_name,
              last_name: custData.last_name,
              company: custData.company,
              address1: custData.address1,
              address2: custData.address2,
              city: custData.city,
              province: custData.province,
              country: custData.country,
              zip: custData.zip || 000000,
              phone: custData.phone,
              name: custData.name,
              province_code: custData.province_code,
              country_code: custData.country_code,
              country_name: custData.country_name,
              default: custData.default,
              updated_at: dateStr,
            },
            {
              where: {
                store_cust_id: Number(body.dataValues.shopify_customer_id),
              },
            }
          )
            .then((updatedAddess) => {
              resolve(updatedAddess);
            })
            .catch((error) => {
              console.log(error);
              reject(error);
            });
        }
      })
      .catch((error) => {
        reject(error);
      });
  }).catch((err) => {
    console.log(err);
    return err.message;
  });
}

function getCntryProvCode(countryName, provinceName) {
  return new Promise((resolve, reject) => {
    let whereCountry = {};
    let whereProvince = {};

    whereCountry.country_name = countryName;
    whereProvince.province_name = provinceName;

    ShopifyCountryMaster.belongsTo(ShopifyProvinceMaster, {
      foreignKey: "country_id",
      targetKey: "country_id",
    });

    return ShopifyCountryMaster.findOne({
      where: whereCountry,
      attributes: ["country_name", "country_code"],
      include: [
        {
          model: ShopifyProvinceMaster,
          where: whereProvince,
          required: true,
          attributes: ["province_name", "province_code"],
        },
      ],
    })
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  }).catch((error) => {
    console.log(error);

    return error;
  });
}
module.exports = CustomerHelper;
