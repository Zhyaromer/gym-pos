const express = require("express");
const router = express.Router();
const add_new_employee = require("../../controllers/employee/add_new_employee");
const delete_employee = require("../../controllers/employee/delete_employee");
const getAllEmployee = require("../../controllers/employee/get_all_employee");
const update_employee_info = require("../../controllers/employee/update_employee_info");
const upload = require('../../middleware/uploadMiddleware');

router.get("/getallemployee", getAllEmployee);

router.post("/addemployee", upload.single('profileImage'), add_new_employee);

router.patch("/updateemployee/:e_id", upload.single('img'), update_employee_info);

router.delete("/deleteemployee/:e_id", delete_employee);

module.exports = router;