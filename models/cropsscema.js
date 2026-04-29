const mongoose = require('mongoose')


const crops_scema = new mongoose.Schema({
    cropName: {
        type: String,
        require: [true, 'please enter Cropname'],
        trim: true,
        default: 'unknown name'
    },
    area: {
        type: Number,
        require: [true, 'please enter area'],
        trim: true,
        default: 'unknown name'
    },
    startDate: {
        type: String,
        require: [true, 'please enter Start Date'],
        trim: true,
    },
    farmerId: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        trim: true,
    },
    status: {
        type: String,
        require: true,
    }



}, { timestamps: true })

const modelcreate = mongoose.model('crop', crops_scema)

module.exports = modelcreate