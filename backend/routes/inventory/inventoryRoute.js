const express = require('express');
const router = express.Router();
const add_product = require('../../controllers/inventory/add_product');
const delete_product = require('../../controllers/inventory/delete_product');
const update_product = require('../../controllers/inventory/update_product');

router.post('/addproduct', add_product);

router.patch('/updateproduct/:product_id', update_product);

router.delete('/deleteproduct/:product_id', delete_product);

module.exports = router;