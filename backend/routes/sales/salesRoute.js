const express = require("express");
const router = express.Router();
const authenticateToken = require("../../middleware/authMiddleware");
const get_all_products = require("../../controllers/sales/get_all_products");
const buying_products = require("../../controllers/sales/buying_products");

router.get("/getallsales", authenticateToken, get_all_products);

router.post("/buyingproducts", authenticateToken, buying_products);

module.exports = router;