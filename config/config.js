const mongoose = require('mongoose')

let dbconnection = async (req, res) => {
    await mongoose.connect('mongodb://127.0.0.1:27017/smart_farming')
}

dbconnection().then(() => console.log('mongodb connected')).catch(err => console.log(err))

