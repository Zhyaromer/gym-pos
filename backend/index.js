const express = require('express')
const app = express()
const port = 3000
const path = require('path')
require("dotenv").config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const authRoute = require('./routes/auth/authRoute')
const memberRoute = require('./routes/member/memberRoute')
const employeeRoute = require('./routes/employee/employeesRoute')
const sallesRoute = require('./routes/sales/salesRoute')
const inventoryRoute = require('./routes/inventory/inventoryRoute')
const expensesRoute = require('./routes/expense/expensesRoute');
const poolRoute = require('./routes/pool/poolRoute');
const membership_plansRoute = require('./routes/membership_plans/membership_plansRoute');
const categoryRoute = require('./routes/category/categoryRoute');
const get_all_expensess_category = require('./routes/expenses_category/expenses_categoryRoute');
const receptionRoute = require('./routes/reception/receptionRoute');

app.use(cors({
    origin : process.env.frontendurl,
    credentials : true
}))

app.use(cookieParser());
app.use(bodyParser.json())
app.use(express.json());
app.use('/imgs', express.static(path.join(__dirname, 'imgs')))

// Auth routes (public)
app.use('/auth', authRoute);

// Protected routes
app.use('/members',memberRoute);
app.use('/employees',employeeRoute);
app.use('/sales',sallesRoute);
app.use('/inventory',inventoryRoute);
app.use('/expenses',expensesRoute);
app.use('/pool',poolRoute);
app.use('/membership_plans',membership_plansRoute);
app.use('/category',categoryRoute);
app.use('/expenses_category',get_all_expensess_category);
app.use('/reception',receptionRoute);

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`server running on port ${port}!`))