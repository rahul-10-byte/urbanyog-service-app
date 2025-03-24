const Orders = require("../models").orders;
const OdersLineItems = require("../models").orders_line_items;
const OrderFulfillments = require("../models").order_fulfillments;
const ProductVarientMaster = require("../models").product_variant_master;

const Op = require("sequelize").Op;
const request = require("request");
const awaitEach = require("await-each");

class OrdersHelper {
  getOrdersFromShopify(link) {
    return new Promise((resolve, reject) => {
      let shopUrl =
        process.env.shopifyStoreURL + "orders.json?status=any&limit=250";

      if (link) {
        shopUrl = link;
      }

      const auth =
        "Basic " +
        Buffer.from(
          process.env.shopifyApiKey + ":" + process.env.shopifyApiPassword
        ).toString("base64");

      const orderOptions = {
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

      request(orderOptions, (err, res, body) => {
        if (err) {
          reject(err);
          console.log("Done");
          return false;
        }

        if (body) {
          let result = JSON.parse(body);
          console.log(result.orders.length);
          if (result.orders) {
            awaitEach(result.orders, async function (item) {
              await addOrders(item);
            })
              .then(function (responses) {
                // console.log(responses);
                getNextLink(res.headers.link);
              })
              .catch((err) => {
                console.log(err);
                reject(err);
              });
          }
        } else {
          console.log("out------------", body);
          resolve(link);
        }
      });
    }).catch((err) => {
      if (err) {
        return err;
      }
    });
  }
}

var orderHelper = new OrdersHelper();

function addOrders(body) {
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
        store_order_id: body.id,
      },
    };

    let discountCode = "";
    if (body.discount_codes.length > 0) {
      discountCode = body.discount_codes[0].code;
    }

    return Orders.findAll(cnd)
      .then((orderResult) => {
        if (orderResult.length <= 0) {
          return Orders.create({
            store_order_id: Number(body.id),
            cust_email: body.email,
            store_id: 1,
            store_order_number: body.order_number,
            payment_gatewy: body.gateway,
            total_price: body.total_price,
            subtotal_price: body.subtotal_price,
            total_tax: body.total_tax,
            currency: body.currency,
            financial_status: body.financial_status,
            confirmed: body.confirmed,
            total_discounts: body.total_discounts,
            total_line_items_price: body.total_line_items_price,
            user_agent: body.client_details.user_agent,
            browser_ip: body.client_details.browser_ip,
            discount_code: discountCode,
            checkout_id: body.checkout_id,
            fulfillment_status: body.fulfillment_status,
            tags: body.tags,
            order_status_url: body.order_status_url,
            order_created_at: body.created_at,
            order_updated_at: body.updated_at,
            order_closed_at: body.closed_at,
            created_at: dateStr,
          })
            .then((result) => {
              awaitEach(body.line_items, async function (item) {
                await addLineItems(item, result);
              })
                .then(function (responses) {
                  // console.log(responses);
                  if (body.fulfillments.length > 0) {
                    awaitEach(
                      body.fulfillments,
                      async function (fulfillmentItem) {
                        await addFulfillments(fulfillmentItem, result);
                      }
                    )
                      .then(function (responses) {
                        // console.log(responses);
                        resolve(responses);
                      })
                      .catch((err) => {
                        console.log(err);
                        reject(err);
                      });
                  } else {
                    resolve(responses);
                  }
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
          return Orders.update(
            {
              cust_email: body.email,
              store_id: 1,
              store_order_number: body.order_number,
              payment_gatewy: body.gateway,
              total_price: body.total_price,
              subtotal_price: body.subtotal_price,
              total_tax: body.total_tax,
              currency: body.currency,
              financial_status: body.financial_status,
              confirmed: body.confirmed,
              total_discounts: body.total_discounts,
              total_line_items_price: body.total_line_items_price,
              user_agent: body.client_details.user_agent,
              browser_ip: body.client_details.browser_ip,
              discount_code: discountCode,
              checkout_id: body.checkout_id,
              fulfillment_status: body.fulfillment_status,
              tags: body.tags,
              order_status_url: body.order_status_url,
              order_created_at: body.created_at,
              order_updated_at: body.updated_at,
              order_closed_at: body.closed_at,
              updated_at: dateStr,
            },
            {
              where: {
                store_order_id: Number(body.id),
              },
            }
          )
            .then((updateResult) => {
              awaitEach(body.line_items, async function (item) {
                await addLineItems(item, orderResult[0]);
              })
                .then(function (responses) {
                  // console.log(responses);
                  if (body.fulfillments.length > 0) {
                    awaitEach(
                      body.fulfillments,
                      async function (fulfillmentItem) {
                        await addFulfillments(fulfillmentItem, orderResult[0]);
                      }
                    )
                      .then(function (responses) {
                        // console.log(responses);
                        resolve(responses);
                      })
                      .catch((err) => {
                        console.log(err);
                        reject(err);
                      });
                  } else {
                    resolve(responses);
                  }
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
        reject(error);
      });
  }).catch((err) => {
    console.log(err);
    return err.message;
  });
}

function addLineItems(line_items, body) {
  console.log("here====================");
  // console.log(body);
  // console.log(line_items);
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
    let orderLineItemCnd = {
      where: {
        store_line_item_id: Number(line_items.id),
      },
    };

    let varientCnd = {
      where: {
        shopify_variant_id: Number(line_items.variant_id),
      },
    };

    return OdersLineItems.findAll(orderLineItemCnd)
      .then((result) => {
        return ProductVarientMaster.findAll(varientCnd)
          .then((varientData) => {
            if (result.length <= 0) {
              return OdersLineItems.create({
                order_id: body.dataValues.order_id,
                store_order_id: body.dataValues.store_order_id,
                store_line_item_id: Number(line_items.id),
                store_id: body.dataValues.store_id,
                store_variant_id: line_items.variant_id,
                store_product_id: line_items.product_id,
                product_title: line_items.title,
                quantity: line_items.quantity,
                sku: line_items.sku,
                pid: varientData[0].dataValues.pid || 0,
                weight: line_items.grams,
                product_price: line_items.price,
                fulfillment_status: line_items.fulfillment_status,
                created_at: dateStr,
              })
                .then((lineItemUpdatedData) => {
                  resolve(lineItemUpdatedData);
                })
                .catch((error) => {
                  reject(error);
                });
            } else {
              //if line items already present then update
              // console.log('inside update ===================>', line_items);
              return OdersLineItems.update(
                {
                  store_order_id: body.dataValues.store_order_id,
                  store_id: body.dataValues.store_id,
                  store_variant_id: line_items.variant_id,
                  store_product_id: line_items.product_id,
                  product_title: line_items.title,
                  quantity: line_items.quantity,
                  sku: line_items.sku,
                  pid: varientData[0].dataValues.pid || 0,
                  weight: line_items.grams,
                  product_price: line_items.price,
                  fulfillment_status: line_items.fulfillment_status,
                  updated_at: dateStr,
                },
                {
                  where: {
                    store_line_item_id: Number(line_items.id),
                  },
                }
              )
                .then((result) => {
                  console.log(result);
                  resolve(result);
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
      })
      .catch((error) => {
        reject(error);
      });
  }).catch((err) => {
    console.log(err);
    return err.message;
  });
}

function addFulfillments(fulfillment_item, body) {
  // console.log('here====================', body.dataValues);
  // console.log('inside fulfillment ===================>', fulfillment_item);
  return new Promise((resolve, reject) => {
    let fulfillmentObj = {};
    fulfillmentObj.id = fulfillment_item.id;
    fulfillmentObj.tracking_company = fulfillment_item.tracking_company;
    fulfillmentObj.shipment_status = fulfillment_item.shipment_status;
    fulfillmentObj.tracking_url = fulfillment_item.tracking_url;
    fulfillmentObj.created_at = fulfillment_item.created_at;
    fulfillmentObj.updated_at = fulfillment_item.updated_at;

    awaitEach(fulfillment_item.line_items, async function (line_tems) {
      await addFulfillmentsWithLineItemId(fulfillmentObj, body, line_tems);
    })
      .then(function (responses) {
        // console.log(responses);
        resolve(responses);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  }).catch((err) => {
    console.log(err);
    return err.message;
  });
}

function addFulfillmentsWithLineItemId(fulfillmentObj, body, line_tems) {
  // console.log(fulfillmentObj);
  // console.log(body);
  // console.log(line_tems);
  // return false;
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
    let orderLineItemCnd = {
      where: {
        store_fulfillment_id: Number(fulfillmentObj.id),
      },
    };

    let varientCnd = {
      where: {
        shopify_variant_id: Number(fulfillmentObj.variant_id),
      },
    };

    return OrderFulfillments.findAll(orderLineItemCnd)
      .then((result) => {
        if (result.length <= 0) {
          return OrderFulfillments.create({
            store_fulfillment_id: Number(fulfillmentObj.id),
            order_id: body.dataValues.order_id,
            store_order_id: body.dataValues.store_order_id,
            store_id: body.dataValues.store_id,
            store_line_item_id: Number(line_tems.id),
            tracking_company: fulfillmentObj.tracking_company,
            shipment_status: fulfillmentObj.shipment_status,
            tracking_url: fulfillmentObj.tracking_url,
            fulfillment_status: fulfillmentObj.fulfillment_status,
            fulfillment_created_at: fulfillmentObj.created_at,
            fulfillment_updated_at: fulfillmentObj.updated_at,
            created_at: dateStr,
          })
            .then((lineItemUpdatedData) => {
              resolve(lineItemUpdatedData);
            })
            .catch((error) => {
              reject(error);
            });
        } else {
          //if line items already present then update
          console.log(
            "inside fulfillment update ===================>",
            fulfillmentObj
          );
          return OrderFulfillments.update(
            {
              store_fulfillment_id: Number(fulfillmentObj.id),
              order_id: body.dataValues.order_id,
              store_order_id: body.dataValues.store_order_id,
              store_id: body.dataValues.store_id,
              store_line_item_id: Number(line_tems.id),
              tracking_company: fulfillmentObj.tracking_company,
              shipment_status: fulfillmentObj.shipment_status,
              tracking_url: fulfillmentObj.tracking_url,
              fulfillment_status: fulfillmentObj.fulfillment_status,
              fulfillment_created_at: fulfillmentObj.created_at,
              fulfillment_updated_at: fulfillmentObj.updated_at,
              updated_at: dateStr,
            },
            {
              where: {
                store_fulfillment_id: Number(fulfillmentObj.id),
              },
            }
          )
            .then((result) => {
              console.log(result);
              resolve(result);
            })
            .catch((error) => {
              console.log(error);
              reject(error);
            });
        }
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  }).catch((err) => {
    console.log(err);
    return err.message;
  });
}

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
          orderHelper.getOrdersFromShopify(text_to_get);
        }, 500);
      } else {
        let obj = {
          statusCode: 100,
          status: true,
          message: "Done",
        };
        orderHelper.getOrdersFromShopify(obj);
      }
    } else {
      var test_str = str;
      var start_pos = test_str.indexOf("<") + 1;
      var end_pos = test_str.indexOf(`>; rel="next"`, start_pos);
      var text_to_get = test_str.substring(start_pos, end_pos);

      timerId = setTimeout(function () {
        orderHelper.getOrdersFromShopify(text_to_get);
      }, 2000);
    }
  } else {
    clearTimeout(timerId);
    return "";
  }
}

module.exports = OrdersHelper;
