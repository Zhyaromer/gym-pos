const express = require('express');
const router = express.Router();

const add_pool = require('../../controllers/pool/add_pool');
const update_pool = require('../../controllers/pool/update_pool');
const delete_pool = require('../../controllers/pool/delete_pool');

router.post('/add_pool', add_pool);

router.patch('/update_pool', update_pool);

router.delete('/delete_pool/:swimmingpool_id', delete_pool);

module.exports = router;