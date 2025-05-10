const express = require("express");
const router = express.Router();
const add_new_employee = require("../../controllers/employee/add_new_employee");
const delete_employee = require("../../controllers/employee/delete_employee");
const getAllEmployee = require("../../controllers/employee/get_all_employee");
const update_employee_info = require("../../controllers/employee/update_employee_info");

router.get("/getallemployee", getAllEmployee);

router.post("/addemployee", add_new_employee);

router.patch("/updateemployee/:e_id", update_employee_info);

router.delete("/deleteemployee/:e_id", delete_employee);

module.exports = router;