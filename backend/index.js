const express = require('express')
const app = express()
const port = 3000
require("dotenv").config();
const db = require('./config/mysql/mysqlconfig')
const cors = require('cors');
const passport = require("passport");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const memberRoute = require('./routes/member/memberRoute')
const employeeRoute = require('./routes/employee/employeesRoute')
const sallesRoute = require('./routes/sales/salesRoute')

app.use(cors({
    origin : process.env.frontendurl,
    credentials : true
}))

app.use(bodyParser.json())
app.use(express.json());

app.use('/members',memberRoute);
app.use('/employees',employeeRoute);
app.use('/sales',sallesRoute);

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`server running on port ${port}!`))