const express = require("express");
const router = express.Router();
const get_all_products = require("../../controllers/sales/get_all_products");
const buying_products = require("../../controllers/sales/buying_products");

router.get("/getallsales", get_all_products);

router.post("/buyingproducts", buying_products);

module.exports = router;