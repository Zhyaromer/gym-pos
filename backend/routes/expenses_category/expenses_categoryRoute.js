const express = require('express');
const router = express.Router();
const get_all_expensess_category = require('../../controllers/expenses_category/get_all_expensess_category');

router.get('/get_all_expensess_category', get_all_expensess_category);

module.exports = router;