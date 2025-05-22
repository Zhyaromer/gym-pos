const express = require('express');
const router = express.Router();
const get_all_category = require('../../controllers/category/get_all_category');

router.get('/getallcategory', get_all_category);

module.exports = router;