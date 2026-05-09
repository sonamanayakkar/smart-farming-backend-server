const mongoose = require('mongoose')


const Cart_Schema = new mongoose.Schema({

    farmerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'please enter farmerid'],
        trim: true,
    },
    buyerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'please enter buyerid'],
        trim: true,
    },
    cropId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'please enter your cropid'],
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
    defaultPrice: {
        type: Number,
        required: true,
    },
    markedPrice: {
        type: Number,
        required: true,
    },
    availableKG: {
        type: Number,
        required: true,
    },

    isOrdered: {
        type: Boolean,
        default: false
    }




}, { timestamps: true })

const modelcreate = mongoose.model('cart', Cart_Schema)

module.exports = modelcreate