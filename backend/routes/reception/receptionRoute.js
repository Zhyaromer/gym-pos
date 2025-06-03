const express = require('express');
const router = express.Router();

const get_reception = require('../../controllers/reception/get_reception');
const update_discount = require('../../controllers/reception/update_discount');
const delete_reception = require('../../controllers/reception/delete_reception');
const delete_item = require('../../controllers/reception/delete_item');

router.get('/get_reception', get_reception);

router.patch('/update_discount', update_discount);

router.delete('/delete_reception/:orderNumber', delete_reception);
router.delete('/delete_item', delete_item);

module.exports = router;