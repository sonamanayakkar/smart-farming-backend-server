const mongoose = require('mongoose')
require('dotenv').config()

let dbconnection = async (req, res) => {

    let env = process.env.NODE_ENV

    if (env == "local") {
        await mongoose.connect('mongodb://127.0.0.1:27017/smart_farming')
    } else {

        await mongoose.connect('mongodb+srv://esonaman2_db_user:RKPocox37@cluster0.ugz4ntp.mongodb.net/smart_farming')
    }


}

dbconnection().then(() => console.log('mongodb connected')).catch(err => console.log(err))

