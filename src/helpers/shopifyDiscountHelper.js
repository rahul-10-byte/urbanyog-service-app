const request = require("request");

class DiscountHelper {
  createPriceRule(priceruleData, res) {
    return new Promise((resolve, reject) => {
      let date = new Date();
      let obj = {};
      let priceRuleObj = {};

      if (priceruleData.title) {
        obj.title = "ug-" + priceruleData.title;
        obj.customer_selection = "prerequisite";
        obj.target_type = "line_item";
        obj.target_selection = "all";
        obj.allocation_method = "across";
        obj.value_type = "fixed_amount";
        obj.value = "-" + priceruleData.value;
        obj.starts_at = new Date().toISOString();
        obj.ends_at = new Date(
          date.setMonth(date.getMonth() + 6)
        ).toISOString();
        obj.prerequisite_customer_ids = [
          priceruleData.prerequisite_customer_ids,
        ];
        obj.usage_limit = 1;
      } else {
        let data = {
          statusCode: 101,
          status: false,
          message: "Discount code is not provided",
        };
        return data;
      }

      priceRuleObj.price_rule = obj;

      let shopUrl = process.env.shopifyStoreURL + "price_rules.json";
      const auth =
        "Basic " +
        Buffer.from(
          process.env.shopifyApiKey + ":" + process.env.shopifyApiPassword
        ).toString("base64");

      const priceRulOptions = {
        url: shopUrl,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: auth,
        },
        body: priceRuleObj,
        json: true,
      };

      request(priceRulOptions, (err, res, body) => {
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
    }).catch((err) => {
      console.log(err);
    });
  }
  createDiscount(disocuntCode, priceRuleId, res) {
    return new Promise((resolve, reject) => {
      let obj = {};
      let discountObj = {};

      if (disocuntCode && priceRuleId) {
        obj.code = disocuntCode;
      } else {
        let data = {
          statusCode: 101,
          status: false,
          message: "Discount code is not provided",
        };
        return data;
      }

      discountObj.discount_code = obj;

      let shopUrl =
        process.env.shopifyStoreURL +
        "price_rules/" +
        priceRuleId +
        "/discount_codes.json";
      const auth =
        "Basic " +
        Buffer.from(
          process.env.shopifyApiKey + ":" + process.env.shopifyApiPassword
        ).toString("base64");
      const priceRulOptions = {
        url: shopUrl,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: auth,
        },
        body: discountObj,
        json: true,
      };

      request(priceRulOptions, (err, res, body) => {
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
    }).catch((err) => {
      console.log(err);
    });
  }
}

module.exports = DiscountHelper;
