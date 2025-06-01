const express = require('express');
const router = express.Router();

const get_reception = require('../../controllers/reception/get_reception');
const update_discount = require('../../controllers/reception/update_discount');

router.get('/get_reception', get_reception);

router.patch('/update_discount', update_discount);

module.exports = router;