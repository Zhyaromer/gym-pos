const express = require('express');
const router = express.Router();
const add_new_member = require('../../controllers/member/add_new_member');
const get_all_members = require('../../controllers/member/get_all_members');

router.get('/getmembers' , get_all_members)

router.post('/addmember', add_new_member);

module.exports = router;  