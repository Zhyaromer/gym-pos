const express = require('express');
const router = express.Router();

const add_expense = require('../../controllers/expense/add_expense');
const delete_expenses = require('../../controllers/expense/delete_expenses');
const get_expenses = require('../../controllers/expense/get_expenses');
const update_expenses = require('../../controllers/expense/update_expenses');

router.get('/get_expenses', get_expenses);

router.post('/add_expense', add_expense);

router.patch('/update_expenses', update_expenses);

router.delete('/delete_expenses/:expenses_id', delete_expenses);

module.exports = router;