const { Sequelize, Op } = require("sequelize");
const { qr_master, cust_qr_scan_order, product_master } = require("../models");

const getQRScanAnalytics = async (req, res) => {
  try {
    const { startDate, endDate, platform } = req.query;

    const platformCondition = platform ? { bought_from: platform } : { bought_from: { [Op.ne]: null } }
    let platformId = null;

    if (platformCondition.bought_from == "Amazon") {
        platformId = 1;
    } else if (platformCondition.bought_from == "Flipkart") {
        platformId = 2;
    } else if (platformCondition.bought_from == "UrbanYog Website") {
        platformId = 3;
    } else if (platformCondition.bought_from == "Meesho") {
        platformId = 4;
    } else if (platformCondition.bought_from == "Nykaa") {
        platformId = 5;
    } else if (platformCondition.bought_from == "Myntra") {
        platformId = 6;
    } else if (platformCondition.bought_from == "Others") {
        platformId = 9;
    }

    if (!startDate || !endDate) {
      return res.status(400).json({ error: "Please provide start_date and end_date in YYYY-MM-DD format" });
    }

    // Generate full date range
    const getDateRange = (start, end) => {
      const dateArray = [];
      let currentDate = new Date(start);
      const stopDate = new Date(end);

      while (currentDate <= stopDate) {
        dateArray.push(currentDate.toISOString().split("T")[0]); // Format YYYY-MM-DD
        currentDate.setDate(currentDate.getDate() + 1);
      }

      return dateArray;
    };

    const dateRange = getDateRange(startDate, endDate);

    // 1️⃣ Total QR Scans Per Day
    const qrScans = await qr_master.findAll({
      attributes: [
        [Sequelize.fn("DATE", Sequelize.col("updated_at")), "date"],
        [Sequelize.fn("COUNT", Sequelize.col("qr_id")), "scan_count"],
      ],
      where: {
        status: 1,
        updated_at: {
          [Op.between]: [startDate + " 00:00:00", endDate + " 23:59:59"],
        },
      },
      group: ["date"],
      order: [[Sequelize.literal("date"), "ASC"]],
      raw: true,
    });

    // 2️⃣ Product Scans Day-by-Day
    const productScansByDay = await cust_qr_scan_order.findAll({
      attributes: [
        [Sequelize.fn("DATE_FORMAT", Sequelize.fn("STR_TO_DATE", Sequelize.col("created_at"), "%d-%m-%Y %H:%i:%s"), "%Y-%m-%d"), "date"],
        [Sequelize.fn("COUNT", Sequelize.col("cust_scan_id")), "scan_count"],
      ],
      where: Sequelize.literal(
        `STR_TO_DATE(created_at, '%d-%m-%Y %H:%i:%s') 
         BETWEEN STR_TO_DATE('${startDate}', '%Y-%m-%d') 
         AND STR_TO_DATE('${endDate} 23:59:59', '%Y-%m-%d %H:%i:%s')`
      ),
      group: ["date"],
      order: [[Sequelize.literal("date"), "ASC"]],
      raw: true,
    });

    // Function to fill missing dates with scan_count: 0
    const fillMissingDates = (data) => {
      const dataMap = new Map(data.map((item) => [item.date, item.scan_count]));

      return dateRange.map((date) => ({
        date,
        scan_count: dataMap.get(date) || 0
      }));
    };

    const totalQRScans = fillMissingDates(qrScans);
    const productScansDayWise = fillMissingDates(productScansByDay);

    // 3️⃣ Product Scans Per Product
    const productScansByProduct = await cust_qr_scan_order.findAll({
      attributes: [
        "bought_product",
        [Sequelize.fn("COUNT", Sequelize.col("cust_scan_id")), "scan_count"],
      ],
      where: {
        bought_product: { [Op.ne]: null },
        [Op.and]: Sequelize.literal(
          `STR_TO_DATE(created_at, '%d-%m-%Y %H:%i:%s') 
           BETWEEN STR_TO_DATE('${startDate}', '%Y-%m-%d') 
           AND STR_TO_DATE('${endDate} 23:59:59', '%Y-%m-%d %H:%i:%s')`
        ),
      },
      group: ["bought_product"],
      order: [[Sequelize.literal("scan_count"), "DESC"]],
      raw: true,
    });

    // 4️⃣ Product Scans Per Platform

    const productScansByPlatform = await cust_qr_scan_order.findAll({
      attributes: [
        "bought_from",
        [Sequelize.fn("COUNT", Sequelize.col("cust_scan_id")), "scan_count"],
      ],
      where: {
        ...platformCondition,
        [Op.and]: Sequelize.literal(
          `STR_TO_DATE(created_at, '%d-%m-%Y %H:%i:%s') 
           BETWEEN STR_TO_DATE('${startDate}', '%Y-%m-%d') 
           AND STR_TO_DATE('${endDate} 23:59:59', '%Y-%m-%d %H:%i:%s')`
        ),
      },
      group: ["bought_from"],
      order: [[Sequelize.literal("scan_count"), "DESC"]],
      raw: true,
    });

    // 5️⃣ Total QR Scanned Per Product (Join `qr_master` with `product_master`)
    const totalQRScansPerProduct = await qr_master.findAll({
      attributes: [
        [Sequelize.col("product_master.product_name"), "product_name"],
        [Sequelize.fn("COUNT", Sequelize.col("qr_master.qr_id")), "scan_count"]
      ],
      include: [
        {
          model: product_master,
          attributes: [],
          required: true
        }
      ],
      where: {
        
        updated_at: {
          [Op.between]: [startDate + " 00:00:00", endDate + " 23:59:59"]
        }
      },
      group: ["product_master.product_name"],
      order: [[Sequelize.literal("scan_count"), "DESC"]],
      raw: true
    });

    // 6️⃣ Total Links Clicked Per Product
    const totalLinksClickedPerProduct = await cust_qr_scan_order.findAll({
      attributes: [
        ["bought_product", "product_name"],
        [Sequelize.fn("COUNT", Sequelize.col("cust_scan_id")), "total_links_clicked"]
      ],
      where: {
        ...platformCondition,
        [Op.and]: Sequelize.literal(
          `STR_TO_DATE(updated_at, '%d-%m-%Y %H:%i:%s') 
           BETWEEN STR_TO_DATE('${startDate}', '%Y-%m-%d') 
           AND STR_TO_DATE('${endDate} 23:59:59', '%Y-%m-%d %H:%i:%s')`
        )
      },
      group: ["bought_product"],
      order: [[Sequelize.literal("total_links_clicked"), "DESC"]],
      raw: true,
    });


    res.json({
      total_qr_scans: totalQRScans,
      product_scans: {
        day_wise: productScansDayWise,
        product_wise: productScansByProduct,
        platform_wise: productScansByPlatform
      },
      qr_scans_per_product: totalQRScansPerProduct,
      links_clicked_per_product: totalLinksClickedPerProduct
    });

  } catch (error) {
    console.error("Error fetching QR scan analytics:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { getQRScanAnalytics };
