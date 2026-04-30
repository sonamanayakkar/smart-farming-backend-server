const mongoose = require('mongoose')
const crops_scema = require('../models/cropsscema.js')
const crops_profitscema = require('../models/crop_profitScema.js')
const labour_schema = require('../models/labourschema.js')
// const { response } = require('express')


// ADD USER

exports.createcrop = async (req, res) => {
    try {
        const { cropName, area, startDate, status } = req.body
        const farmerId = req.user.userId


        const crop = await crops_scema.create({
            cropName,
            area,
            farmerId: farmerId,
            startDate,
            status,
        })

        // profit collection will create while crop collection create
        await crops_profitscema.create({
            farmerId: farmerId,
            cropId: crop._id,
            totalExpences: 0,
            saleAmount: 0,
            profit: {
                amount: 0,
                percentage: 0
            },
            expenses: [],
            Isclosed: false,
            endDate: null
        })

        // await labour_schema.create({
        //     farmerId: farmerId,
        //     cropId: crop._id,
        //     endDate: null,
        //     attendance: [],
        //     isCompleted: false
        // })

        if (crop) {
            return res.status(200).send({
                status: true,
                message: 'crop Created successfully!',
                response: crop
            })
        } else {
            return res.status(400).send({
                status: false,
                message: 'crop not added',
                response: crop
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

// FIND ALL CROP

exports.findallCrop = async (req, res) => {


    try {
        // const userreq = req.body
        const crop = req.user.userId

        // const findcrop = await crops_scema.find({ farmerId: new mongoose.Types.ObjectId(crop) })

        const findcrop = await crops_scema.aggregate([
            { $match: { farmerId: new mongoose.Types.ObjectId(crop) } },
            { $sort: { createdAt: -1 } },

            {
                $lookup: {
                    from: 'profits',
                    localField: '_id',
                    foreignField: 'cropId',
                    as: 'cropwith_profit'
                }
            },

            {
                $addFields: {
                    Expences: { $sum: "$cropwith_profit.totalExpences" },
                    Profit: { $sum: "$cropwith_profit.profit.amount" },

                }
            },

            {
                $facet: {
                    lists: [
                        {
                            $project: {
                                Expences: 1,
                                Profit: 1,
                                cropName: 1,
                                area: 1,
                                startDate: 1,
                                status: 1,
                            }
                        }
                    ],
                    expenses: [
                        {
                            $group: {
                                _id: null,
                                totalExpenses: { $sum: "$Expences" },
                                totalProfits: { $sum: "$Profit" }
                            }
                        }
                    ]
                }
            }



        ])




        if (!findcrop) {
            return res.status(404).send({
                status: false,
                message: 'crops not found'
            });

        }


        //  success
        return res.status(200).send({
            status: true,
            message: 'crops fetched successfully!',
            response: findcrop
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

exports.deleteCrop = async (req, res) => {
    try {
        const userreq = req.params.crop_id
        console.log(userreq);

        const findcrop = await crops_scema.deleteOne({ _id: Object(userreq) })
        const cropprofit = await crops_profitscema.deleteOne({ cropId: userreq })


        if (!findcrop) {
            return res.status(404).send({
                status: false,
                message: 'crop not deleted'
            });

        }


        //  success
        return res.status(200).send({
            status: true,
            message: 'crop deleted successfully!',
            response: findcrop
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
exports.updateCrop = async (req, res) => {
    try {
        console.log('elei');
        const userreq = req.params.crop_id
        const userreqbody = req.body


        const findcrop = await crops_scema.findByIdAndUpdate(userreq, userreqbody, { new: true })


        if (!findcrop) {
            return res.status(404).send({
                status: false,
                message: 'crop not updated'
            });

        }

        //  success
        return res.status(200).send({
            status: true,
            message: 'crop updated successfully!',
            response: findcrop
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

