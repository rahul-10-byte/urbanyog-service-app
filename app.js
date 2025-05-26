const express = require("express");
const exphbs = require("express-handlebars");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
require("dotenv").config();
const Joi = require("joi");
const db = require("./src/models"); // 👈 Centralized model access

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

app.post('/request-a-call', async (req, res) => {
  const schema = Joi.object({
    custName: Joi.string().required().error(new Error('Provide custName (string)')),
    contactNo: Joi.string().min(10).max(13).required().error(new Error('Provide valid contactNo (10–13 digits)')),
    productId: Joi.number().required().error(new Error('Provide productId (number)')),
    productName: Joi.string().required().error(new Error('Provide productName (string)')),
    createdDate: Joi.date().optional().error(new Error('Provide valid createdDate (date)')),
  });

  const { error, value } = schema.validate(req.body);

  if (error) {
    return res.status(422).json({
      statusCode: 422,
      status: 'error',
      message: 'Invalid request data',
      data: error.message,
    });
  }

  try {
    const saved = await db.UrbanyogCallRequest.create(value);

    return res.status(200).json({
      statusCode: 100,
      status: true,
      message: 'Call Request created successfully',
      data: saved,
    });
  } catch (err) {
    console.error('DB Error:', err);
    return res.status(500).json({
      statusCode: 101,
      status: false,
      message: 'Failed to save Call Request',
      data: err,
    });
  }
});

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
