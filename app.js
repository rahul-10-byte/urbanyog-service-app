const express = require("express");
const cors = require("cors"); // Import CORS middleware
const app = express();
require("dotenv").config();
const path = require("path");
const bodyParser = require("body-parser");

const productScanVerificationController = require("./src/controller/productScanVerification");

// Use CORS middleware
app.use(cors()); // Enable CORS for all routes

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // Use `extended: true` for form data

app.get("/", (req, res) => res.send("verify-prod on Vercel"));

// Product Scan Controller Endpoints
app.post('/verifyProduct', productScanVerificationController.verifyProduct);
app.post('/getSuspiciousVerification', productScanVerificationController.getSuspiciousVerification);
app.post('/getProductVerification', productScanVerificationController.getProductVerification);
app.post('/getQRCodeDetails', productScanVerificationController.getQRCodeDetails);
app.post('/downloadQRScanCSV', productScanVerificationController.downloadQRScanCSV);

const port = process.env.PORT || 3002;
const host = process.env.HOST || 'localhost'; // Provide default host if not set
app.listen(port, () => {
  console.log(`Server is listening on ${host}:${port}`);
});
