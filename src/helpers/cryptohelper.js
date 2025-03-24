require("dotenv").config();
const CryptoJS = require("crypto-js");
const cryptoKey = process.env.cryptoKey;

class cryptoHelper {
  decryptObj(aesData) {
    return new Promise((resolve, reject) => {
      let bytes = "";
      let decryptData = "";
      let decryptRes = {};
      try {
        bytes = CryptoJS.AES.decrypt(aesData.toString(), cryptoKey);
        let notNegative;
        if (bytes) {
          notNegative = bytes.words.filter((data) => {
            return data < 0;
          });

          if (notNegative.length === 0) {
            decryptData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            decryptRes.statusCode = 100;
            decryptRes.status = true;
            decryptRes.message = "Decrypted successfully";
            decryptRes.data = decryptData;
            resolve(decryptRes);
          } else {
            decryptRes.statusCode = 101;
            decryptRes.status = false;
            decryptRes.message = "Wrong encrypted codes";
            decryptRes.data = "";
            reject(decryptRes);
          }
        }
      } catch (error) {
        let errResp = {
          statusCode: 101,
          status: false,
          message: "Wrong encrypted codes",
          data: "",
        };
        reject(errResp);
      }
    }).catch((error) => {
      return error;
    });
  }
}

module.exports = cryptoHelper;
