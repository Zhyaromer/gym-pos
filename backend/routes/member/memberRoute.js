const express = require('express');
const router = express.Router();
const add_new_member = require('../../controllers/member/add_new_member');
const get_all_members = require('../../controllers/member/get_all_members');
const delete_member = require('../../controllers/member/delete_member');
const get_specified_member = require('../../controllers/member/get_specified_member');
const update_member_info = require('../../controllers/member/update_member_info');
const update_membership = require('../../controllers/member/update_membership');
const add_member_pool = require('../../controllers/member/add_member_pool');
const upload = require('../../middleware/uploadMiddleware');

router.get('/getmembers' , get_all_members);
router.get('/getspecifiedmember', get_specified_member);

router.post('/addmember', add_new_member);
router.post('/updatemember/:m_id', update_member_info);
router.post('/updatemembership/:m_id', update_membership);
router.post('/addmemberpool', upload.single('image'), add_member_pool);

router.delete('/deletemember/:m_id', delete_member);

module.exports = router;  