const mongoose = require('mongoose')
const labour_schema = require('../models/labourschema.js')



exports.addLabour = async (req, res) => {


    try {
        const user_req = req.body
        const cropId = req.params.cropid
        const userId = req.user.userId
        console.log(userId);

        console.log(user_req);



        // const labour = await labour_schema.findOneAndUpdate({ cropId: cropId }, { $push: { attendance: user_req } }, { new: true })
        const labour = await labour_schema.create({
            date: user_req.date,
            labourName: user_req.labourName,
            salary: user_req.salary,
            farmerId: new mongoose.Types.ObjectId(userId),
            cropId: new mongoose.Types.ObjectId(cropId),
            status: "active"
        })
        if (labour) {
            return res.status(200).send({
                status: true,
                message: "labour added successfully!",
                response: labour
            })
        } else {
            return res.status(400).send({
                status: false,
                message: "labour added successfully!",
                response: labour
            })
        }
    }
    catch (error) {
        console.log(error);

        return res.status(400).send({
            status: false,
            message: "Internal server Error",
            response: error
        })
    }
}

exports.getall_labour = async (req, res) => {


    try {
        const cropid = req.params.cropid



        // const crop = await labour_schema.findOne({ cropId: cropid })

        // const crop = await labour_schema.aggregate([{ $match: { cropId: new mongoose.Types.ObjectId(cropid) } },
        // {
        //     $project: {
        //         farmerId: 1,
        //         cropId: 1,
        //         attendance: 1,
        //         isCompleted: 1,
        //         totalItems: { $size: "$attendance" },
        //         totalsalary: { $sum: "$attendance.salary" }
        //     }
        // }
        // ])

        const crop = await labour_schema.aggregate([{ $match: { cropId: new mongoose.Types.ObjectId(cropid), status: "active" } },
        {
            $group: {
                _id: "$cropId",
                totalsalary: { $sum: "$salary" },
                labours: {
                    $push: {
                        _id: "$_id",
                        labourName: "$labourName",
                        date: "$date",
                        salary: "$salary",
                        status: "$status"
                    }
                }
            }
        }
        ])





        if (crop) {
            return res.status(200).send({
                status: true,
                message: 'labour data fetched successfully!',
                response: crop
            })
        } else {
            return res.status(400).send({
                status: false,
                message: 'labour data  not fetched',
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
// exports.getone_labour = async (req, res) => {


//     try {
//         const cropid = req.params.cropid
//         console.log(cropid);


//         const crop = await labour_schema.aggregate([{ $match: { cropId: new mongoose.Types.ObjectId(cropid) } },
//         {
//             $project: {
//                 farmerId: 1,
//                 cropId: 1,
//                 attendance: 1,
//                 totalItems: { $size: "$attendance" },
//                 totalsalary: { $sum: "$attendance.salary" }
//             }
//         }
//         ])





//         if (crop) {
//             return res.status(200).send({
//                 status: true,
//                 message: 'labour data fetched successfully!',
//                 response: crop
//             })
//         } else {
//             return res.status(400).send({
//                 status: false,
//                 message: 'labour data  not fetched',
//                 response: crop
//             })
//         }



//     } catch (error) {
//         console.log(error);

//         return res.status(400).send({
//             status: false,
//             message: 'Internal server error ',
//             response: error
//         })
//     }
// }

exports.delete_labour = async (req, res) => {



    try {


        const crop_url = req.params.cropid
        const userId = req.user.userId
        console.log("elei");


        const labour = await labour_schema.findOneAndDelete({ cropId: crop_url })



        if (labour) {
            return res.status(200).send({
                status: true,
                message: 'labour deleted successfully!',
                response: labour
            })
        } else {
            return res.status(400).send({
                status: false,
                message: 'labour not deleted',
                response: labour
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
exports.emptythe_labour = async (req, res) => {




    try {
        const crop_url = req.params.cropid
        const labourid = req.params.labourid



        const labour = await labour_schema.updateMany({ cropId: crop_url }, { $set: { status: "closed" } })



        if (labour) {
            return res.status(200).send({
                status: true,
                message: 'labour deleted successfully!',
                response: labour
            })
        } else {
            return res.status(400).send({
                status: false,
                message: 'labour not deleted',
                response: labour
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
exports.update_labour = async (req, res) => {



    try {
        const crop_url = req.params.cropid
        const labourid = req.params.labourid
        const update_data = req.body;
        console.log(update_data);




        // const labour = await labour_schema.findOneAndUpdate({ cropId: crop_url, "attendance._id": labourid },
        //     {
        //         $set: {
        //             "attendance.$.date": update_data.date,
        //             "attendance.$.labourName": update_data.labourName,
        //             "attendance.$.salary": update_data.salary
        //         }
        //     }
        // )

        const labour = await labour_schema.findOneAndUpdate({ cropId: crop_url, _id: labourid }, {
            $set: {
                date: update_data.date,
                labourName: update_data.labourName,
                salary: update_data.salary
            }
        })



        if (labour) {
            return res.status(200).send({
                status: true,
                message: 'labour deleted successfully!',
                response: labour
            })
        } else {
            return res.status(400).send({
                status: false,
                message: 'labour not deleted',
                response: labour
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
exports.labour_history = async (req, res) => {



    try {
        const labourId = (req.params.labourIds).split(",")
        // const cropId = req.params.cropid
        // const update_data = req.body;

        const objectIds = labourId.map(ele => new mongoose.Types.ObjectId(ele))
        console.log(objectIds);


        const findlabour = await labour_schema.aggregate([
            { $match: { _id: { $in: objectIds } } },

            {
                $group: {
                    _id: null,
                    paid: { $sum: "$salary" },

                    labours: {
                        $push: {
                            date: "$date",
                            labourName: "$labourName",
                            salary: "$salary",
                           
                        }
                    }
                }
            }
        ])
        



        if (findlabour) {
            return res.status(200).send({
                status: true,
                message: 'labour deleted successfully!',
                response: findlabour
            })
        } else {
            return res.status(400).send({
                status: false,
                message: 'labour not deleted',
                response: findlabour
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