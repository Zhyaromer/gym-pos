const express = require('express')
const app = express()
const port = 3000
const path = require('path')
require("dotenv").config();
const db = require('./config/mysql/mysqlconfig')
const cors = require('cors');
const passport = require("passport");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const memberRoute = require('./routes/member/memberRoute')
const employeeRoute = require('./routes/employee/employeesRoute')
const sallesRoute = require('./routes/sales/salesRoute')
const inventoryRoute = require('./routes/inventory/inventoryRoute')
const attendenceRoute = require('./routes/attendance/attendenceRoute');
const expensesRoute = require('./routes/expense/expensesRoute');
const poolRoute = require('./routes/pool/poolRoute');
const membership_plansRoute = require('./routes/membership_plans/membership_plansRoute');
const categoryRoute = require('./routes/category/categoryRoute');

app.use(cors({
    origin : process.env.frontendurl,
    credentials : true
}))

app.use(bodyParser.json())
app.use(express.json());
app.use('/imgs', express.static(path.join(__dirname, 'imgs')))

app.use('/members',memberRoute);
app.use('/employees',employeeRoute);
app.use('/sales',sallesRoute);
app.use('/inventory',inventoryRoute);
app.use('/attendence',attendenceRoute);
app.use('/expenses',expensesRoute);
app.use('/pool',poolRoute);
app.use('/membership_plans',membership_plansRoute);
app.use('/category',categoryRoute);

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`server running on port ${port}!`))