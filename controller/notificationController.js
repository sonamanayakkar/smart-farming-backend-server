const { default: mongoose } = require('mongoose');
const notification_schema = require('../models/notification_schema')
const order_schema = require('../models/ordersSchema')

exports.otpverification = async (req, res) => {
    try {
        const { buyerId, orderId } = req.body


        const otp = Math.floor(100000 + Math.random() * 900000);



        const otpgenerate = await notification_schema.create({
            buyerId: new mongoose.Types.ObjectId(buyerId),
            OTP: otp
        })

        const addotponorders = await order_schema.findByIdAndUpdate(orderId, { $set: { OTP: otp } }, { new: true })

        if (otpgenerate) {
            return res.status(200).send({
                status: true,
                message: "otp generated",
                response: otpgenerate
            })
        } else {
            return res.status(400).send({
                status: false,
                message: "otp not generated",
                response: otpgenerate
            })
        }


    } catch (error) {
        console.log(error);


        return res.status(400).send({
            status: false,
            message: "Internal server error!",
            response: null
        })
    }
}
exports.getOTP = async (req, res) => {
    try {
        const { id } = req.params

        console.log(id);

        const otpget = await notification_schema.find({ buyerId: id })



        if (otpget) {
            return res.status(200).send({
                status: true,
                message: "Your OTP",
                response: otpget
            })
        } else {
            return res.status(400).send({
                status: false,
                message: "otp not getted",
                response: otpget
            })
        }


    } catch (error) {
        console.log(error);


        return res.status(400).send({
            status: false,
            message: "Internal server error!",
            response: null
        })
    }
}
exports.Otpcheck = async (req, res) => {
    try {
        const { orderId, OTP, buyerId } = req.body

     
        



        const findorder = await order_schema.find({ _id: new mongoose.Types.ObjectId(orderId), OTP: OTP })

        if (findorder.length > 0) {
            const delivered = await order_schema.findByIdAndUpdate(orderId, { $set: { status: 'Delivered' } }, { new: true })
            await notification_schema.deleteMany({ buyerId: new mongoose.Types.ObjectId(buyerId) })

            return res.status(200).send({
                status: true,
                message: "Order Delivered Successfully!",
                response: delivered
            })
        }
        else {
            return res.status(400).send({
                status: false,
                message: "Incorrect OTP",
                response: delivered
            })
        }





    } catch (error) {
        console.log(error);


        return res.status(400).send({
            status: false,
            message: "Internal server error!",
            response: null
        })
    }
}