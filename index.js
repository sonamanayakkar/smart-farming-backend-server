require('dotenv').config()
const express = require('express')
const app = express()
const useroutes = require('./routes/userroutes.js')
const corspolicy = require('cors')
const databaseconnection = require('./config/config.js')
const users_scema = require('./models/users_scema.js')

const port = 4500
app.use(corspolicy())
app.use(express.json())

app.use('/api/v1/agreesmart', useroutes)

app.listen(port, () => {
    console.log(`localhost:${port}`);

})