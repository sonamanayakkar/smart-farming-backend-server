const mongoose = require('mongoose')

const cart_schema = require('../models/addToCartSchema.js')
const userSchema = require('../models/users_scema.js')

exports.createCart = async (req, res) => {
    try {
        const { cropId, farmerId, cropName, quantity, defaultPrice, markedPrice, availableKG } = req.body
        const token = req.user.userId


        const postCart = await cart_schema.create({
            farmerId,
            buyerId: token,
            cropId,
            cropName,
            quantity,
            defaultPrice,
            markedPrice,
            availableKG
        })
        if (postCart) {
            return res.status(200).send({
                status: true,
                message: "Product added to Cart!",
                response: postCart
            })
        } else {
            return res.status(400).send({
                status: false,
                message: "croplist added failed",
                response: postCart
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

exports.getCart = async (req, res) => {
    try {
        const userId = req.user.userId

        const cartitems = await cart_schema.aggregate([
            { $match: { buyerId: new mongoose.Types.ObjectId(userId) } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'farmerId',
                    foreignField: '_id',
                    as: 'userwithCart'
                }
            },

            {
                $facet: {
                    items: [],
                    totalamount: [
                        {
                            $group: {
                                _id: null,
                                total: { $sum: "$markedPrice" }
                            }
                        }
                    ]
                }
            }
        ])

        if (cartitems) {
            return res.status(200).send({
                status: true,
                message: "Cart list fetched!",
                response: cartitems
            })
        } else {
            return res.status(400).send({
                status: false,
                message: "Cart list not fetched",
                response: cartitems
            })
        }


    }

    catch (error) {
        console.log(error);
        return res.status(400).send({
            status: false,
            message: "Internal Server error!",
            response: null
        })
    }
}

exports.deleteCart = async (req, res) => {
    try {
        const { id } = req.params

        const cartitems = await cart_schema.findOneAndDelete({ _id: new mongoose.Types.ObjectId(id) })

        if (cartitems) {
            return res.status(200).send({
                status: true,
                message: "Cart list fetched!",
                response: cartitems
            })
        } else {
            return res.status(400).send({
                status: false,
                message: "Cart list not fetched",
                response: cartitems
            })
        }


    }

    catch (error) {
        console.log(error);
        return res.status(400).send({
            status: false,
            message: "Internal Server error!",
            response: null
        })
    }
}
exports.updateCart = async (req, res) => {
    try {
        const { id } = req.params
        const request = req.body
        console.log(request);
        console.log(id);



        const cartitems = await cart_schema.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, { quantity: request.quantity, markedPrice: request.price }, { new: true })

        if (cartitems) {
            return res.status(200).send({
                status: true,
                message: "Cart list fetched!",
                response: cartitems
            })
        } else {
            return res.status(400).send({
                status: false,
                message: "Cart list not fetched",
                response: cartitems
            })
        }


    }

    catch (error) {
        console.log(error);
        return res.status(400).send({
            status: false,
            message: "Internal Server error!",
            response: null
        })
    }
}
