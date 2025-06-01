const express = require('express');
const router = express.Router();

const get_reception = require('../../controllers/reception/get_reception');

router.get('/get_reception', get_reception);

module.exports = router;