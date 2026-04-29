const mongoose = require('mongoose')

// const labour_schema = new mongoose.Schema({
//     attendance: [{
//         date: {
//             type: String,
//             require: true
//         },
//         labourName: {
//             type: String,
//             required: [true, "Please enter Labour Name"],
//             trim: true
//         },
//         salary: {
//             type: Number,
//             required: [true, "Please enter Labour salary"],

//         },
//     }],

//     farmerId: {
//         type: mongoose.Schema.Types.ObjectId,
//         required: true

//     },
//     cropId: {
//         type: mongoose.Schema.Types.ObjectId,
//         required: true
//     },
//     endDate: {
//         type: Date,

//     },
//     isCompleted: {
//         type: Boolean
//     }



// }, { timestamps: true })
const labour_schema = new mongoose.Schema({

    date: {
        type: String,
        require: true
    },
    labourName: {
        type: String,
        required: [true, "Please enter Labour Name"],
        trim: true
    },
    salary: {
        type: Number,
        required: [true, "Please enter Labour salary"],

    },


    farmerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true

    },
    cropId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    status: {
        type: String
    }



}, { timestamps: true })


const modelcreate = mongoose.model('labour', labour_schema)

module.exports = modelcreate