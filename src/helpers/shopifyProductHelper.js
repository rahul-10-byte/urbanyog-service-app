const Productmaster = require("../models").product_master;
const Productvariant = require("../models").product_variant_master;
const Op = require("sequelize").Op;
const request = require("request");

class productHelper {
  getProductFromShopify(req, res) {
    return new Promise((resolve, reject) => {
      const auth =
        "Basic " +
        Buffer.from(
          process.env.shopifyApiKey + ":" + process.env.shopifyApiPassword
        ).toString("base64");

      const productOptions = {
        url: "https://urbangabru-mens-lifestyle.myshopify.com/admin/api/2020-07/products.json",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: auth,
        },
        qs: {
          limit: 250,
        },
      };

      request(productOptions, (err, res, body) => {
        if (err) {
          reject(err);
        }
        let result = JSON.parse(body);

        var itemsProcessed = 0;
        result.products.forEach(async (data, item, array) => {
          itemsProcessed++;

          let returnData = await this.addProduct(data).then((result) => {
            //   console.log(result);
          });

          if (itemsProcessed === array.length) {
            let resArr = [1];
            resolve(resArr);
          } else {
            let resArr = [];
            resolve(resArr);
          }
        });
      });
    }).catch((err) => {
      return err.message;
    });
  }

  addProduct(body) {
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
          product_id: body.id,
        },
      };
      let title = "";

      if (body.title) {
        title = body.title.replace("<br>", " ");
      }

      return Productmaster.findAll(cnd)
        .then((result) => {
          if (result.length <= 0) {
            return Productmaster.create({
              product_id: Number(body.id),
              product_name: title,
              product_handle: body.handle,
              product_category: body.product_type,
              product_img_url: body.images[0].src,
              store_name: "shopify",
              created_at: dateStr,
            })
              .then((result) => {
                var itemsProcessed = 0;
                body.variants.forEach(async (data, item, array) => {
                  itemsProcessed++;

                  let returnData = await this.addVarints(
                    result.dataValues.pid,
                    data
                  ).then((vrntResult) => {
                    // console.log(vrntResult);
                  });

                  if (itemsProcessed === array.length) {
                    let resArr = [1];
                    resolve(result);
                  } else {
                    let resArr = [];
                    resolve(result);
                  }
                });
              })
              .catch((error) => {
                reject(error);
              });
          } else {
            return Productmaster.update(
              {
                product_name: title,
                product_handle: body.handle,
                product_category: body.product_type,
                product_img_url: body.images[0].src,
                store_name: "shopify",
                updated_at: dateStr,
              },
              {
                returning: true,
                where: {
                  product_id: Number(body.id),
                  store_name: "shopify",
                },
              }
            )
              .then((result) => {
                var itemsProcessed = 0;
                body.variants.forEach(async (data, item, array) => {
                  itemsProcessed++;

                  let returnData = await this.addVarints(0, data).then(
                    (vrntResult) => {
                      // console.log(vrntResult);
                    }
                  );

                  if (itemsProcessed === array.length) {
                    let resArr = [1];
                    resolve(result);
                  } else {
                    let resArr = [];
                    resolve(result);
                  }
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
      return err.message;
    });
  }

  addVarints(pid, body) {
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
          shopify_variant_id: body.id,
        },
      };

      return Productvariant.findAll(cnd)
        .then((result) => {
          if (result.length <= 0) {
            return Productvariant.create({
              shopify_variant_id: Number(body.id),
              pid: pid,
              weight: body.title,
              selling_price: body.price,
              base_price: body.compare_at_price,
              sku: body.sku,
              product_img_url: "",
              store_name: "shopify",
              created_at: dateStr,
            })
              .then((result) => {
                resolve(result);
              })
              .catch((error) => {
                console.log(error);
                reject(error);
              });
          } else {
            return Productvariant.update(
              {
                weight: body.title,
                selling_price: body.price,
                base_price: body.compare_at_price,
                sku: body.sku,
                product_img_url: "",
                store_name: "shopify",
                updated_at: dateStr,
              },
              {
                where: {
                  shopify_variant_id: Number(body.id),
                  store_name: "shopify",
                },
              }
            )
              .then((result) => {
                resolve(result);
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
      return err.message;
    });
  }
}

module.exports = productHelper;
