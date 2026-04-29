const mongoose = require('mongoose')


const users_scema = new mongoose.Schema({
    firstName: {
        type: String,
        require: [true, 'please enter firstName'],
        trim: true,
        default: 'unknown name'
    },
    lastName: {
        type: String,
        require: [true, 'please enter firstName'],
        trim: true,
        default: 'unknown name'
    },
    email: {
        type: String,
        require: [true, 'please enter your email'],
        trim: true,
        unique: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'Please use a valid email']
    },
    phoneNumber: {
        type: String,
        require: [true, 'please enter your phone number'],
        trim: true,
    },

    password: {
        type: String,
        require: [true, 'please enter your password'],
        trim: true,
        minlength: 8,
    },
    district: {
        type: String,
        require: [true, 'please enter district'],
        trim: true,

    },
    role: {
        type: String,
        require: [true, 'please choose role'],
    },
    profileImage: {
        type: String,
        default:'https://cdn-icons-png.flaticon.com/512/149/149071.png'
    }

}, { timestamps: true })

const modelcreate = mongoose.model('user', users_scema)

module.exports = modelcreate