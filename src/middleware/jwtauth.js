var jwt = require("jsonwebtoken");
var config = require("../config/config.json");

module.exports = {
  async verifyToken(req, res, next) {
    var token = req.headers.authorization;
    console.log("token: ", token);

    if (!token) {
      return res.status(401).send({
        statusCode: 101,
        status: "false",
        message: "Token not provided.",
      });
    } else {
      const token_array = token.split(" ");
      console.log("token: ", token_array[1]);

      jwt.verify(token_array[1], config.secret, function (err, decoded) {
        var today = new Date();
        var tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);
        var dates_as_int = [tomorrow];
        var dates = dates_as_int.map(function (dateStr) {
          return new Date(dateStr).getTime();
        });
        if (err) {
          res.status(401).send({
            statusCode: 101,
            status: "false",
            message: "Failed to authenticate token.",
          });
        } else if (dates < decoded.exp) {
          res.status(401).send({
            statusCode: 101,
            status: "false",
            message: "Token expired",
          });
        } else {
          next();
        }
      });
    }
  },
};
