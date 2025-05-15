const express = require('express');
const router = express.Router();

const get_plans = require('../../controllers/membership_plans/get_plans');
const update_plan = require('../../controllers/membership_plans/update_plan');

router.get('/get_plans', get_plans);

router.patch('/update_plan/:plan_id', update_plan);

module.exports = router;
