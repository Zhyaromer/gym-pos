const express = require('express');
const router = express.Router();
const authenticateToken = require('../../middleware/authMiddleware');

const get_reception = require('../../controllers/reception/get_reception');
const update_discount = require('../../controllers/reception/update_discount');
const delete_reception = require('../../controllers/reception/delete_reception');
const delete_item = require('../../controllers/reception/delete_item');
const add_item = require('../../controllers/reception/add_item');

router.get('/get_reception', authenticateToken, get_reception);

router.post('/add_item', authenticateToken, add_item);

router.patch('/update_discount', authenticateToken, update_discount);

router.delete('/delete_reception/:orderNumber', authenticateToken, delete_reception);
router.delete('/delete_item', authenticateToken, delete_item);

module.exports = router;