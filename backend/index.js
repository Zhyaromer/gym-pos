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

app.use(cors({
    origin : process.env.frontendurl,
    credentials : true
}))

app.use(cookieParser())
app.use(bodyParser.json())

app.use('/members',memberRoute);

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`server running on port ${port}!`))