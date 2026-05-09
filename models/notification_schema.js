
const mongoose = require('mongoose')


const notification_schema = new mongoose.Schema({
    buyerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    OTP: {
        type: Number,
        required: true
    }
}, { timestamps: true })

const modelcreation = mongoose.model('notification', notification_schema)
module.exports = modelcreation
