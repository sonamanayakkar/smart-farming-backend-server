const mongoose = require('mongoose')


const order_schema = new mongoose.Schema({

    buyerName: {
        type: String,
        require: true
    },
    buyerPhoneNumber: {
        type: String,
        require: true
    },

    farmerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'please enter buyerid'],
    },
    cropId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'please enter buyerid'],
        trim: true,
    },
    cropName: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },

    buyerAddress: {
        street: {
            type: String,
            require: true
        },
        city: {
            type: String,
            require: true
        },
        pincode: {
            type: String,
            require: true
        }
    },
    buyerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'please enter buyerid'],
        trim: true,
    },

    status: {
        type: String,
        default: 'Pending'
    },
    paymentMethod: {
        type: String,

    },
    paymentStatus: {
        type: String,
    },
    OTP: {
        type: Number,
        default: null
    }




}, { timestamps: true })

const modelcreate = mongoose.model('order', order_schema)

module.exports = modelcreate