const mongoose = require('mongoose')
const crops_profitscema = require('../models/crop_profitScema.js')
const crops_scema = require('../models/cropsscema.js')
const labour_schema = require('../models/labourschema.js')
// const { response } = require('express')


// ADD USER

exports.pushProfit = async (req, res) => {


    try {
        const crop_url = req.params.crop_id
        const user_req = req.body
        console.log(crop_url);

        console.log(user_req);





        const crop = await crops_profitscema.findOneAndUpdate({ cropId: new mongoose.Types.ObjectId(crop_url) }, { $push: { expenses: user_req } }, { new: true })

        const getamount = await crops_profitscema.aggregate([
            { $match: { cropId: new mongoose.Types.ObjectId(crop_url) } },
            { $unwind: "$expenses" },
            {
                $group: {
                    _id: "$cropId",
                    totalexpense: { $sum: "$expenses.Amount" }
                }
            }
        ])

        console.log(getamount);




        const againupdate = await crops_profitscema.findOneAndUpdate({ cropId: new mongoose.Types.ObjectId(crop_url) }, { $set: { totalExpences: getamount[0].totalexpense } })
        await crops_scema.findOneAndUpdate({ _id: crop_url }, { $set: { status: "In Progress" } })

        if (againupdate) {
            return res.status(200).send({
                status: true,
                message: 'expense added successfully!',
                response: againupdate
            })
        } else {
            return res.status(400).send({
                status: false,
                message: 'expense not added',
                response: againupdate
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

exports.getProfit = async (req, res) => {


    try {
        const user_url = req.params.crop_id

        // const crop = await crops_profitscema.find({ cropId: user_url })

        const crop = await crops_scema.aggregate([{ $match: { _id: new mongoose.Types.ObjectId(user_url) } },
        {
            $lookup: {
                from: "profits",
                localField: '_id',
                foreignField: 'cropId',
                as: "crops_withProfitsData"
            }
        }
        ])
        // console.log(crop);


        if (crop) {
            return res.status(200).send({
                status: true,
                message: 'expense fetched successfully!',
                response: crop
            })
        } else {
            return res.status(400).send({
                status: false,
                message: 'expense not fetched',
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

exports.deleteProfit = async (req, res) => {



    try {
        const crop_url = req.params.crop_id
        const expence_url = req.params.expence_id


        const expence = await crops_profitscema.findOneAndUpdate({ cropId: crop_url }, { $pull: { expenses: { _id: expence_url } } })

        const updateexpence = await crops_profitscema.aggregate([
            { $match: { cropId: new mongoose.Types.ObjectId(crop_url) } },
            { $unwind: "$expenses" },
            {
                $group: {
                    _id: "$cropId",
                    totalexpense: { $sum: "$expenses.Amount" }
                }
            }
        ])

        let againupdate;
        if (updateexpence.length > 0) {
            againupdate = await crops_profitscema.findOneAndUpdate({ cropId: new mongoose.Types.ObjectId(crop_url) }, { $set: { totalExpences: updateexpence[0].totalexpense } })
        } else {
            againupdate = await crops_profitscema.findOneAndUpdate({ cropId: new mongoose.Types.ObjectId(crop_url) }, { $set: { totalExpences: 0 } })
        }

        if (againupdate) {
            return res.status(200).send({
                status: true,
                message: 'expense deleted successfully!',
                response: expence
            })
        } else {
            return res.status(400).send({
                status: false,
                message: 'expense not deleted',
                response: expence
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

exports.updateProfit = async (req, res) => {



    try {
        const crop_url = req.params.crop_id
        const expence_url = req.params.expence_id
        const update_data = req.body
        console.log(update_data);



        const expence = await crops_profitscema.findOneAndUpdate(
            { cropId: crop_url, "expenses._id": expence_url },
            {
                $set: {
                    "expenses.$.date": update_data.date,
                    "expenses.$.item": update_data.item,
                    "expenses.$.Amount": update_data.Amount,
                }
            }, { new: true })


        const getexpense = await crops_profitscema.aggregate([
            { $match: { cropId: new mongoose.Types.ObjectId(crop_url) } },
            { $unwind: "$expenses" },
            {
                $group: {
                    _id: "$cropId",
                    totalexpence: { $sum: "$expenses.Amount" }
                }
            }
        ])

        const updateexpence = await crops_profitscema.findOneAndUpdate({ cropId: new mongoose.Types.ObjectId(crop_url) }, { $set: { totalExpences: getexpense[0].totalexpence } })
        if (updateexpence) {
            return res.status(200).send({
                status: true,
                message: 'expense updated successfully!',
                response: expence
            })
        } else {
            return res.status(400).send({
                status: false,
                message: 'expense not update',
                response: expence
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

exports.updateAllAmount = async (req, res) => {



    try {
        const crop_url = req.params.crop_id
        const update_data = req.body




        const updateamount = await crops_profitscema.findOneAndUpdate(
            { cropId: new mongoose.Types.ObjectId(crop_url) },
            {
                $set: { saleAmount: update_data.saled, Isclosed: true, "profit.amount": update_data.finalAmount, "profit.percentage": update_data.profit, endDate: update_data.endDate }
            }, { new: true })

        await crops_scema.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(crop_url) }, { $set: { status: "Completed" } })
        await labour_schema.findOneAndUpdate({ cropId: new mongoose.Types.ObjectId(crop_url) }, { $set: { isCompleted: true } })



        if (updateamount) {
            return res.status(200).send({
                status: true,
                message: 'expense updated successfully!',
                response: updateamount
            })
        } else {
            return res.status(400).send({
                status: false,
                message: 'expense not update',
                response: updateamount
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



exports.getallprofit = async (req, res) => {


    try {

        const userId = req.user.userId


        const { year, status } = req.query




        let matchingobj = { farmerId: new mongoose.Types.ObjectId(userId) }

        if (year && !isNaN(year)) {
            const start = new Date(`${year}-01-01T00:00:00.000Z`);
            const end = new Date(`${year}-12-31T23:59:59.999Z`);
            matchingobj.startDate = {
                $regex: `^${year}`
            };


        }
        if (status !== "null") {
            matchingobj.status = status
        }



        // const crop = await crops_scema.aggregate([
        //     {
        //         $match: matchingobj
        //     },
        //     {
        //         $facet: {

        //             //  1. Get all crops
        //             crops: [
        //                 {
        //                     $project: {
        //                         cropName: 1,
        //                         area: 1,
        //                         startDate: 1,
        //                         status: 1
        //                     }
        //                 }
        //             ],


        //             summary: [
        //                 {
        //                     $lookup: {
        //                         from: "profits",
        //                         localField: "_id",
        //                         foreignField: "cropId",
        //                         as: "profit"
        //                     }
        //                 },
        //                 {
        //                     $unwind: "$profit"
        //                 },

        //                 // ✅ 1. group per crop
        //                 {
        //                     $group: {
        //                         _id: "$_id",
        //                         cropName: { $first: "$cropName" },

        //                         totalExpenses: { $sum: "$profit.totalExpences" },
        //                         totalSaleAmount: { $sum: "$profit.saleAmount" },
        //                         totalProfit: { $sum: "$profit.profit.amount" },
        //                     }
        //                 }
        //             ],

        //             //  2. Get summary from profits
        //             summaryTotal: [
        //                 {
        //                     $lookup: {
        //                         from: "profits",
        //                         localField: "_id",
        //                         foreignField: "cropId",
        //                         as: "profit"
        //                     }
        //                 },
        //                 {
        //                     $unwind: "$profit"
        //                 },
        //                 {
        //                     $group: {
        //                         _id: null,

        //                         totalDivestry: { $sum: 1 }, //  count
        //                         totalExpenses: { $sum: "$profit.totalExpences" },
        //                         totalSaleAmount: { $sum: "$profit.saleAmount" },
        //                         totalProfit: { $sum: "$profit.profit.amount" },

        //                     }
        //                 }
        //             ]
        //         }
        //     },
        //     {
        //         $project: {
        //             crops: 1,
        //             totalDivestry: { $arrayElemAt: ["$summary.totalDivestry", 0] },
        //             totalExpenses: { $arrayElemAt: ["$summary.totalExpenses", 0] },
        //             totalSaleAmount: { $arrayElemAt: ["$summary.totalSaleAmount", 0] },
        //             totalProfit: { $arrayElemAt: ["$summary.totalProfit", 0] }
        //         }
        //     }
        // ]);

        const crop = await crops_scema.aggregate([
            {
                $match: matchingobj
            },
            {
                $lookup: {
                    from: "profits",
                    localField: "_id",
                    foreignField: "cropId",
                    as: "profit"
                }
            },
            {
                $unwind: {
                    path: "$profit",
                    preserveNullAndEmptyArrays: true
                }
            },

            // per crop calculation
            {
                $group: {
                    _id: "$_id",
                    cropName: { $first: "$cropName" },
                    area: { $first: "$area" },
                    status: { $first: "$status" },
                    startDate: { $first: "$startDate" },

                    totalExpenses: { $sum: "$profit.totalExpences" },
                    totalSaleAmount: { $sum: "$profit.saleAmount" },
                    totalProfit: {
                        $sum: {
                            $subtract: [
                                "$profit.saleAmount",
                                "$profit.totalExpences"
                            ]
                        }
                    }
                }
            },

            {
                $facet: {

                    // 1. crops list with profit per crop
                    crops: [
                        {
                            $project: {
                                cropName: 1,
                                area: 1,
                                status: 1,
                                startDate: 1,
                                totalExpenses: 1,
                                totalSaleAmount: 1,
                                totalProfit: 1
                            }
                        }
                    ],

                    //  2. total summary
                    summaryTotal: [
                        {
                            $group: {
                                _id: null,
                                totalDivestry: { $sum: 1 },
                                totalExpenses: { $sum: "$totalExpenses" },
                                totalSaleAmount: { $sum: "$totalSaleAmount" },
                                totalProfit: { $sum: "$totalProfit" }
                            }
                        }
                    ]
                }
            },

            {
                $project: {
                    crops: 1,
                    totalDivestry: { $arrayElemAt: ["$summaryTotal.totalDivestry", 0] },
                    totalExpenses: { $arrayElemAt: ["$summaryTotal.totalExpenses", 0] },
                    totalSaleAmount: { $arrayElemAt: ["$summaryTotal.totalSaleAmount", 0] },
                    totalProfit: { $arrayElemAt: ["$summaryTotal.totalProfit", 0] }
                }
            }
        ]);



        if (crop) {
            return res.status(200).send({
                status: true,
                message: 'expense fetched successfully!',
                response: crop
            })
        } else {
            return res.status(400).send({
                status: false,
                message: 'expense not fetched',
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


exports.getprofitOnly = async (req, res) => {


    try {


        const crop = await crops_profitscema.aggregate([
            // { $match: { "profit.amount": { $gt: 0 } } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'farmerId',
                    foreignField: '_id',
                    as: 'Profitwith_user'
                }
            },
            {
                $lookup: {
                    from: 'crops',
                    localField: 'cropId',
                    foreignField: '_id',
                    as: 'Profitwith_crop'
                }
            }
        ])

        const crop2 = await crops_profitscema.aggregate([
           
            {$group:{
                _id:null,
                saleAmount:{$sum:"$saleAmount"},
                totalProfit:{$sum:{$cond:[{$gt:["$profit.amount",0]},"$profit.amount",0]}},
                totalLoss:{$sum:{$cond:[{$lt:["$profit.amount",0]},"$profit.amount",0]}},
            }},
            {$project:{
                _id:0,
                saleAmount:1,
                totalProfit:1,
                totalLoss:1,
                profitPercentage:{$cond:[{$eq:["$saleAmount",0]},0,
                {$multiply:[{$divide:["$totalProfit","$saleAmount"]},100]}
            ]}
            }}
        ])





        console.log(crop2);



        if (crop) {
            return res.status(200).send({
                status: true,
                message: 'expense fetched successfully!',
                response: { crop, crop2 }
            })
        } else {
            return res.status(400).send({
                status: false,
                message: 'expense not fetched',
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