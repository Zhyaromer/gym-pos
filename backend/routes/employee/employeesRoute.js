const express = require("express");
const router = express.Router();
const add_new_employee = require("../../controllers/employee/add_new_employee");
const delete_employee = require("../../controllers/employee/delete_employee");
const getAllEmployee = require("../../controllers/employee/get_all_employee");
const update_employee_info = require("../../controllers/employee/update_employee_info");
const get_all_employee_paycheck = require("../../controllers/employee/get_all_employee_paycheck");
const paying_employee = require("../../controllers/employee/paying_employee");
const delete_employee_paycheck = require("../../controllers/employee/delete_employee_paycheck");
const mark_full_payment = require("../../controllers/employee/mark_full_payment");
const upload = require('../../middleware/uploadMiddleware');

router.get("/getallemployee", getAllEmployee);
router.get("/getallemployeepaycheck", get_all_employee_paycheck);

router.post("/addemployee", upload.single('profileImage'), add_new_employee);
router.post("/payingemployee/:e_id", paying_employee);

router.patch("/markfullpayment/:e_id/:year/:month", mark_full_payment);
router.patch("/updateemployee/:e_id", upload.single('img'), update_employee_info);

router.delete("/deleteemployee/:e_id", delete_employee);
router.delete("/deleteemployeepaycheck/:ep_id", delete_employee_paycheck);

module.exports = router;