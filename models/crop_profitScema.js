const mongoose = require('mongoose')


const crops_profitscema = new mongoose.Schema({

    farmerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'please enter your phone number'],
        trim: true,
    },
    cropId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'please enter your phone number'],
        trim: true,
    },
    totalExpences: {
        type: Number,
        required: true,
    },
    saleAmount: {
        type: Number,
        required: true,
    },
    profit: {
        amount: {
            type: Number,
            require: true,

        },
        percentage: {
            type: Number,
            require: true,

        }
    },
    expenses: [{
        date: {
            type: String,
            required: true
        },
        item: {
            type: String,
            required: true
        },
        Amount: {
            type: Number,
            required: true
        },
        labourIds: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "labour"
            }
        ]
    }],
    Isclosed: {
        type: Boolean,
        require: true
    },
    endDate: {
        type: String,

    }





}, { timestamps: true })

const modelcreate = mongoose.model('profit', crops_profitscema)

module.exports = modelcreate