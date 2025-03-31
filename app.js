const express = require("express");
const exphbs = require("express-handlebars");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
require("dotenv").config();

const productScanVerificationController = require("./src/controller/productScanVerification");
const qrsController = require("./src/controller/qrsController");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (CSS, images, JS)
app.use(express.static(path.join(__dirname, "public")));

// Set Handlebars as the view engine
app.engine("hbs", exphbs.engine({ extname: ".hbs", defaultLayout: false }));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

// Homepage route
app.get("/", (req, res) => res.send("verify-prod on Vercel"));

// Product Scan Controller Endpoints
app.post("/verifyProduct", productScanVerificationController.verifyProduct);
app.post("/getSuspiciousVerification", productScanVerificationController.getSuspiciousVerification);
app.post("/getProductVerification", productScanVerificationController.getProductVerification);
app.post("/getQRCodeDetails", productScanVerificationController.getQRCodeDetails);
app.post("/downloadQRScanCSV", productScanVerificationController.downloadQRScanCSV);


app.get("/getQRScanData", qrsController.getQRScanAnalytics);


// Route to render the dashboard
app.get("/scans", async (req, res) => {
    res.render("dashboard");
  });

// Start server
const port = process.env.PORT || 3002;
const host = process.env.HOST || "localhost";
app.listen(port, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
