const Resend = require('resend')
const { default: mongoose } = require('mongoose')
const order_schema = require('../models/ordersSchema')
const cart_schema = require('../models/addToCartSchema.js')
const user_schema = require('../models/users_scema.js')
const croplist_schema = require('../models/cropList_Schema')



exports.createOrder = async (req, res) => {
    try {
        const { name, phone, street, city, pincode, paymentMethod } = req.body
        const token = req.user.userId



        const getCarts = await cart_schema.aggregate([
            { $match: { buyerId: new mongoose.Types.ObjectId(token) } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'buyerId',
                    foreignField: '_id',
                    as: 'u'
                }
            }

        ])



        let orderItems = getCarts.map((ele, idx) => (
            {
                farmerId: ele.farmerId,
                buyerId: ele.buyerId,
                cropId: ele.cropId,
                cropName: ele.cropName,
                quantity: ele.quantity,
                price: ele.markedPrice,
                user: ele.u
            }
        ))

        const totalamount = orderItems.reduce((sum, item) => sum + item.price, 0)




        let createorder;
        for (const item of orderItems) {
            createorder = await order_schema.create({
                buyerId: new mongoose.Types.ObjectId(token),
                buyerName: name,
                buyerPhoneNumber: phone,
                farmerId: item.farmerId,
                cropId: item.cropId,
                cropName: item.cropName,
                quantity: item.quantity,
                price: item.price,
                paymentMethod: paymentMethod,
                items: orderItems,
                status: "PENDING",
                buyerAddress: {
                    street: street,
                    city: city,
                    pincode: pincode
                }
            })
        }



        for (const item of orderItems) {
            await croplist_schema.updateOne(
                { _id: item.cropId },
                {
                    $inc: {
                        availableKG: -item.quantity,
                        soldKG: item.quantity,
                        soldPrice: item.price
                    }
                }
            )
        }

        const deleteCart = await cart_schema.deleteMany({ buyerId: new mongoose.Types.ObjectId(token) })




        if (createorder) {
            return res.status(200).send({
                status: true,
                message: "Order Confirmed!",
                response: createorder
            })
        } else {
            return res.status(400).send({
                status: false,
                message: "Order Failed",
                response: createorder
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(400).send({
            status: false,
            message: "Internal Server error!",
            response: null
        })

    }
}

exports.getOrders = async (req, res) => {
    try {

        const token = req.user.userId



        const getorders = await order_schema.aggregate([
            { $match: { buyerId: new mongoose.Types.ObjectId(token) } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'farmerId',
                    foreignField: '_id',
                    as: 'u'
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            }

        ])







        if (getorders) {
            return res.status(200).send({
                status: true,
                message: "Order Confirmed!",
                response: getorders
            })
        } else {
            return res.status(400).send({
                status: false,
                message: "Order Failed",
                response: getorders
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(400).send({
            status: false,
            message: "Internal Server error!",
            response: null
        })

    }
}
exports.getallOrders = async (req, res) => {
    try {

        const token = req.user.userId



        const getorders = await order_schema.aggregate([
            { $match: { status: "PENDING" } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'buyerId',
                    foreignField: '_id',
                    as: 'u'
                }
            },
          
        ])



        if (getorders) {
            return res.status(200).send({
                status: true,
                message: "Order Confirmed!",
                response: getorders
            })
        } else {
            return res.status(400).send({
                status: false,
                message: "Order Failed",
                response: getorders
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(400).send({
            status: false,
            message: "Internal Server error!",
            response: null
        })

    }
}
exports.cancelOrder = async (req, res) => {
    try {

        const { _id, cropId, quantity, price } = req.body




        const updateproductlist = await croplist_schema.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(cropId) },
            {
                $inc: {
                    soldKG: -quantity,
                    soldPrice: -price,
                    availableKG: quantity
                }
            }
        )

        const cancelorder = await order_schema.findOneAndDelete({ _id })





        if (cancelorder) {
            return res.status(200).send({
                status: true,
                message: "order Cancelled!",
                response: cancelorder
            })
        } else {
            return res.status(400).send({
                status: false,
                message: "not canceled",
                response: cancelorder
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(400).send({
            status: false,
            message: "Internal Server error!",
            response: null
        })

    }
}


