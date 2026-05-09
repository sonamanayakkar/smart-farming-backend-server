const mongoose = require('mongoose')
const users_scema = require('../models/users_scema.js')
const crop_schema = require('../models/cropsscema.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { response } = require('express')


// ADD USER

exports.createUser = async (req, res) => {
    try {

        const { firstName, lastName, email, phoneNumber, password, district, role } = req.body


        const checkemail = await users_scema.find({ email: email })

        if (checkemail.length < 1) {
            const hashedPassword = await bcrypt.hash(password, 10)
            const user = await users_scema.create({
                firstName,
                lastName,
                email,
                phoneNumber,
                password: hashedPassword,
                district,
                role,

            })
            if (user) {
                return res.status(200).send({
                    status: true,
                    message: 'Account Created Successfully!',
                    response: checkemail
                })
            } else {
                return res.status(400).send({
                    status: false,
                    message: 'data not added',
                    response: checkemail
                })
            }
        }
        else {
            return res.status(400).send({
                status: false,
                message: 'Email already hasvregistered',
                response: null
            })
        }

    } catch (error) {
        console.log(error);

        return res.status(400).send({
            status: false,
            message: 'Internal server error ',
            response: error
        })
    }
}

// FIND ALL USER

exports.findOneUser = async (req, res) => {
    try {
        const { email, password, role } = req.body


        const finduser = await users_scema.findOne({ email: email })

        if (!finduser) {
            return res.status(404).send({
                status: false,
                message: 'User not found'
            });

        }

        const ismatch = await bcrypt.compare(password, finduser.password)
        //  check password
        if (!ismatch) {
            return res.status(401).send({
                status: false,
                message: 'Password mismatched'
            });
        }

        //  check role
        if (role !== finduser.role) {
            return res.status(401).send({
                status: false,
                message: 'Role mismatched'
            });
        }

        const jwttoken = jwt.sign({ userId: finduser._id }, process.env.JWT_SECRET, { expiresIn: '1h' }
        )

        //  success
        return res.status(200).send({
            status: true,
            message: 'Login successful',
            response: jwttoken,
            response2: finduser
        });

    }
    catch (error) {
        console.log(error);

        return res.status(400).send({
            status: false,
            message: 'Internal server error1',
            response: error
        });
    }
}

exports.updateUser = async (req, res) => {
    try {


        const { firstName, lastName, phoneNumber, district } = req.body
        const userId = req.user.userId
        const file = req.file?.path


        const searchUser = await users_scema.find({ _id: new mongoose.Types.ObjectId(userId) })


        if (!searchUser) {
            return res.status(401).send({
                status: false,
                message: 'User not Found'
            });
        }

        const updateuser = await users_scema.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(userId) },
            { $set: { firstName: firstName, lastName: lastName, phoneNumber: phoneNumber, district: district, profileImage: file } }, { new: true })

        if (updateuser) {
            return res.status(200).send({
                status: true,
                message: "Updated Successfully",
                response: updateuser
            })
        } else {
            return res.status(401).send({
                status: false,
                message: "Updation failed",
                response: updateuser
            })
        }






    }
    catch (error) {
        console.log(error);

        return res.status(400).send({
            status: false,
            message: "Internal Server Error",
            response: error
        })
    }
}


exports.recentUser = async (req, res) => {
    try {

        const topUser = await users_scema.aggregate([
            {
                $facet: {
                    users: [
                        {
                            $match: {
                                $or: [{ role: "farmer" }, { role: "buyer" }]
                            }
                        },
                        {
                            $lookup: {
                                from: 'crops',
                                localField: '_id',
                                foreignField: 'farmerId',
                                as: 'userwith_cropdata'
                            }
                        },
                        {
                            $lookup: {
                                from: 'profits',
                                localField: '_id',
                                foreignField: 'farmerId',
                                as: 'userwith_profitdata'
                            }
                        },

                        { $sort: { createdAt: -1 } },
                        {
                            $addFields: {
                                totalActiveCrops: {
                                    $size: {
                                        $filter: {
                                            input: "$userwith_cropdata",
                                            as: "crop",
                                            cond: { $ne: ["$$crop.status", "Completed"] }
                                        }
                                    }
                                }
                            }
                        },
                        {
                            $addFields: {
                                profitperuser: { $sum: '$userwith_profitdata.profit.amount' }
                            }
                        }



                    ],

                    buyers: [{ $match: { role: "buyer" } }],

                    farmers: [{ $match: { role: "farmer" } }],

                    totalProfit: [
                        { $limit: 1 },
                        {
                            $replaceWith: {}   // remove dependency on users
                        },
                        {
                            $lookup: {
                                from: 'profits',
                                pipeline: [
                                    {
                                        $group: {
                                            _id: null,
                                            total: { $sum: '$profit.amount' }
                                        }
                                    }
                                ],
                                as: 'allprofits'
                            }
                        },
                        {
                            $project: {
                                totalProfit: { $arrayElemAt: ['$allprofits.total', 0] }
                            }
                        }
                    ],

                    totalcrops: [

                        {
                            $lookup: {
                                from: 'profits',
                                pipeline: [
                                    { $match: { status: { $ne: "Completed" } } },
                                ],
                                as: 'totalcrops'
                            }
                        }
                    ]


                }

            },

            {
                $addFields: {
                    totalprofits: {
                        $arrayElemAt: ['$totalProfit.totalProfit', 0]
                    },
                }
            }

        ])

        const activecrops = await crop_schema.find( { status: { $ne: 'Completed' } })

        if (topUser) {
            return res.status(200).send({
                status: true,
                message: "top user fetched Successfully",
                response: { topUser, activecrops }
            })
        } else {
            return res.status(401).send({
                status: true,
                message: "fetched failed!!!",
                response: topUser
            })
        }

    }
    catch (error) {
        console.log(error);

        return res.status(400).send({
            status: false,
            message: "Internal server error",
            response: error
        })
    }
}
exports.alluser = async (req, res) => {
    try {
        const { name } = req.query
        console.log(name);

        let nameobj = {}

        if (name !== '') {
            nameobj.firstName = { $regex: name, $options: 'i' }

        }
        console.log(nameobj);

        const topUser = await users_scema.aggregate([
            { $match: nameobj },
            {
                $facet: {
                    users: [
                        { $match: { role: "farmer" } },
                        {
                            $lookup: {
                                from: 'crops',
                                localField: '_id',
                                foreignField: 'farmerId',
                                as: 'userwith_cropdata'
                            }
                        },
                        {
                            $lookup: {
                                from: 'profits',
                                localField: '_id',
                                foreignField: 'farmerId',
                                as: 'userwith_profitdata'
                            }
                        },

                        { $sort: { createdAt: 1 } },
                        {
                            $addFields: {
                                totalActiveCrops: {
                                    $size: {
                                        $filter: {
                                            input: "$userwith_cropdata",
                                            as: "crop",
                                            cond: { $ne: ["$$crop.status", "Completed"] }
                                        }
                                    }
                                }
                            }
                        },
                        {
                            $addFields: {
                                profitperuser: { $sum: '$userwith_profitdata.profit.amount' }
                            }
                        }



                    ],

                    totalProfit: [
                        { $limit: 1 },
                        {
                            $replaceWith: {}   // remove dependency on users
                        },
                        {
                            $lookup: {
                                from: 'profits',
                                pipeline: [
                                    {
                                        $group: {
                                            _id: null,
                                            total: { $sum: '$profit.amount' }
                                        }
                                    }
                                ],
                                as: 'allprofits'
                            }
                        },
                        {
                            $project: {
                                totalProfit: { $arrayElemAt: ['$allprofits.total', 0] }
                            }
                        }
                    ],

                    totalcrops: [

                        {
                            $lookup: {
                                from: 'profits',
                                pipeline: [
                                    { $match: { status: { $ne: "Completed" } } },
                                ],
                                as: 'totalcrops'
                            }
                        }
                    ]


                }

            },

            {
                $addFields: {
                    totalprofits: {
                        $arrayElemAt: ['$totalProfit.totalProfit', 0]
                    },
                }
            }

        ])

        if (topUser) {
            return res.status(200).send({
                status: true,
                message: "top user fetched Successfully",
                response: topUser
            })
        } else {
            return res.status(401).send({
                status: true,
                message: "fetched failed!!!",
                response: topUser
            })
        }

    }
    catch (error) {
        return res.status(400).send({
            status: false,
            message: "Internal server error",
            response: error
        })
    }
}
exports.allBuyers = async (req, res) => {
    try {
        const { name } = req.query
        console.log(name);

        let nameobj = {}

        if (name !== '') {
            nameobj.firstName = { $regex: name, $options: 'i' }

        }
        console.log(nameobj);

        const topUser = await users_scema.aggregate([
            { $match: nameobj },
            {
                $facet: {
                    users: [
                        { $match: { role: "buyer" } },
                        {
                            $lookup: {
                                from: 'crops',
                                localField: '_id',
                                foreignField: 'farmerId',
                                as: 'userwith_cropdata'
                            }
                        },
                        {
                            $lookup: {
                                from: 'profits',
                                localField: '_id',
                                foreignField: 'farmerId',
                                as: 'userwith_profitdata'
                            }
                        },

                        { $sort: { createdAt: 1 } },
                        {
                            $addFields: {
                                totalActiveCrops: {
                                    $size: {
                                        $filter: {
                                            input: "$userwith_cropdata",
                                            as: "crop",
                                            cond: { $ne: ["$$crop.status", "Completed"] }
                                        }
                                    }
                                }
                            }
                        },
                        {
                            $addFields: {
                                profitperuser: { $sum: '$userwith_profitdata.profit.amount' }
                            }
                        }



                    ],

                    totalProfit: [
                        { $limit: 1 },
                        {
                            $replaceWith: {}   // remove dependency on users
                        },
                        {
                            $lookup: {
                                from: 'profits',
                                pipeline: [
                                    {
                                        $group: {
                                            _id: null,
                                            total: { $sum: '$profit.amount' }
                                        }
                                    }
                                ],
                                as: 'allprofits'
                            }
                        },
                        {
                            $project: {
                                totalProfit: { $arrayElemAt: ['$allprofits.total', 0] }
                            }
                        }
                    ],

                    totalcrops: [

                        {
                            $lookup: {
                                from: 'profits',
                                pipeline: [
                                    { $match: { status: { $ne: "Completed" } } },
                                ],
                                as: 'totalcrops'
                            }
                        }
                    ]


                }

            },

            {
                $addFields: {
                    totalprofits: {
                        $arrayElemAt: ['$totalProfit.totalProfit', 0]
                    },
                }
            }

        ])

        if (topUser) {
            return res.status(200).send({
                status: true,
                message: "top user fetched Successfully",
                response: topUser
            })
        } else {
            return res.status(401).send({
                status: true,
                message: "fetched failed!!!",
                response: topUser
            })
        }

    }
    catch (error) {
        return res.status(400).send({
            status: false,
            message: "Internal server error",
            response: error
        })
    }
}