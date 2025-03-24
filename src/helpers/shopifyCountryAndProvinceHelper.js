const ShopifyCountryMaster = require("../models").shopify_country_master;
const ShopifyProvinceMaster = require("../models").shopify_province_master;
const Op = require("sequelize").Op;
const request = require("request");
const awaitEach = require("await-each");

class CountryAndProvinceHelper {
  getCountryAndProvince(req, res) {
    return new Promise((resolve, reject) => {
      const auth =
        "Basic " +
        Buffer.from(
          process.env.shopifyApiKey + ":" + process.env.shopifyApiPassword
        ).toString("base64");

      const productOptions = {
        url: "https://urbangabru-mens-lifestyle.myshopify.com/admin/api/2020-07/countries.json",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: auth,
        },
        // qs: {
        // limit: 250,
        // },
      };

      request(productOptions, (err, res, body) => {
        if (err) {
          reject(err);
        }

        if (body) {
          if (body.errors) {
            reject(body.errors);
          } else {
            let result = JSON.parse(body);
            let { countries } = result;
            awaitEach(countries, async function (item) {
              await addCountry(item);
            })
              .then(function (result) {
                console.log(result);

                let response = {
                  statusCode: 100,
                  status: false,
                  message: "Data added successfully",
                  data: [],
                };
                resolve(response);
              })
              .catch((err) => {
                console.log(err);
                let response = {
                  statusCode: 101,
                  status: false,
                  message: "Operation failed",
                  data: err,
                };
                reject(response);
              });
          }
        }
      });
    }).catch((err) => {
      return err.message;
    });
  }
}

function addCountry(item) {
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
    let countryCnd = {
      where: {
        country_id: Number(item.id),
      },
    };

    return ShopifyCountryMaster.findAll(countryCnd)
      .then((result) => {
        if (result.length <= 0) {
          return ShopifyCountryMaster.create({
            country_id: item.id,
            country_name: item.name,
            country_tax: item.tax,
            country_code: item.code,
            tax_name: item.tax_name,
            created_at: dateStr,
          })
            .then((countryData) => {
              let { provinces } = item;
              awaitEach(provinces, async function (item) {
                await addProvince(item);
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
          //if address already present then update
          return ShopifyCountryMaster.update(
            {
              country_name: item.name,
              country_tax: item.tax,
              country_code: item.code,
              tax_name: item.tax_name,
              updated_at: dateStr,
            },
            {
              where: {
                country_id: Number(item.id),
              },
            }
          )
            .then((updatedCountryData) => {
              let { provinces } = item;
              awaitEach(provinces, async function (item) {
                await addProvince(item);
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

function addProvince(item) {
  // console.log(item);
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
    let provinceCnd = {
      where: {
        province_id: Number(item.id),
      },
    };

    return ShopifyProvinceMaster.findAll(provinceCnd)
      .then((result) => {
        if (result.length <= 0) {
          return ShopifyProvinceMaster.create({
            country_id: item.country_id,
            province_id: item.id,
            province_name: item.name,
            province_code: item.code,
            province_tax: item.tax,
            province_tax_name: item.tax_name,
            province_tax_type: item.tax_type,
            province_shipping_zone_id: item.shipping_zone_id,
            tax_percentage: item.tax_percentage,
            created_at: dateStr,
          })
            .then((provinceData) => {
              resolve(provinceData);
            })
            .catch((error) => {
              reject(error);
            });
        } else {
          //if address already present then update
          return ShopifyProvinceMaster.update(
            {
              province_name: item.name,
              province_code: item.code,
              province_tax: item.tax,
              province_tax_name: item.tax_name,
              province_tax_type: item.tax_type,
              province_shipping_zone_id: item.shipping_zone_id,
              tax_percentage: item.tax_percentage,
              updated_at: dateStr,
            },
            {
              where: {
                province_id: Number(item.id),
              },
            }
          )
            .then((updatedProvinceData) => {
              resolve(updatedProvinceData);
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
module.exports = CountryAndProvinceHelper;
