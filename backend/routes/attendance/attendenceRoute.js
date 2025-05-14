const express = require('express');
const router = express.Router();
const add_attendence_record = require('../../controllers/attendance/add_attendence_record');
const update_attendence = require('../../controllers/attendance/update_attendence');
const delete_attendence = require('../../controllers/attendance/delete_attendence');
const attendance_summary = require('../../controllers/attendance/attendance_summary');
const get_attended_employees = require('../../controllers/attendance/get_attended_employees');

router.get('/attendancesummary', attendance_summary);
router.get('/attendedemployees', get_attended_employees);

router.post('/addattendence', add_attendence_record);

router.patch('/updateattendence', update_attendence);

router.delete('/deleteattendence/:attendence_id', delete_attendence);

module.exports = router;