const mongoose = require('mongoose')


const croplist_schema = new mongoose.Schema({
    cropName: {
        type: String,
        require: [true, 'please enter Cropname'],
        trim: true,
        default: 'unknown name'
    },

    totalKG: {
        type: Number,
        require: true
    },
    availableKG: {
        type: Number,
        require: true,
        default:0
    },
    soldKG: {
        type: Number,
        require: true,
        default:0
    },
    soldPrice: {
        type: Number,
        require: true,
        default:0
    },
    priceperkg: {
        type: Number,
        require: true
    },
    district: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    farmerId: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        trim: true,
    }
},{timestamps:true})

const modelcreate = mongoose.model('croplist', croplist_schema)

module.exports = modelcreate