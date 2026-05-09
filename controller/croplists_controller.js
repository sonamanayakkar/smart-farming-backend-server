const croplist_schema = require('../models/cropList_Schema')
const users_schema = require('../models/users_scema.js')


exports.createLists = async (req, res) => {
    try {
        const request = req.body
        const token = req.user.userId

        const crop = await croplist_schema.create({
            farmerId: token,
            cropName: request.cropName,
            totalKG: request.totalKG,
            availableKG: request.availableKG,
            priceperkg: request.priceperkg,
            district: request.district,
            description: request.description
        })
        if (crop) {
            return res.status(200).send({
                status: true,
                message: "croplist added successfully!",
                response: crop
            })
        } else {
            return res.status(400).send({
                status: false,
                message: "croplist added failed",
                response: crop
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(400).send({
            status: false,
            message: "Internal Server error!",
            response: crop
        })

    }
}
exports.updateLists = async (req, res) => {
    try {
        const { updateid } = req.params
        const request = req.body
        const token = req.user.userId


        const oldcrop = await croplist_schema.findById(updateid);

        const cropupdate = await croplist_schema.findByIdAndUpdate(
            updateid,
            {
                $set:
                {

                    cropName: request.cropName,
                    totalKG: request.totalKG,
                    availableKG: request.totalKG - oldcrop.soldKG,
                    priceperkg: request.priceperkg,
                    district: request.district,
                    description: request.description
                },

            },

            { new: true })


        if (cropupdate) {
            return res.status(200).send({
                status: true,
                message: "croplist Updated successfully!",
                response: cropupdate
            })
        } else {
            return res.status(400).send({
                status: false,
                message: "croplist update failed",
                response: cropupdate
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(400).send({
            status: false,
            message: "Internal Server error!",
            response: crop
        })

    }
}
exports.deleteLists = async (req, res) => {
    try {
        const { deleteid } = req.params

        const deleteproduct = await croplist_schema.findByIdAndDelete(deleteid);




        if (deleteproduct) {
            return res.status(200).send({
                status: true,
                message: "product Deleted successfully!",
                response: deleteproduct
            })
        } else {
            return res.status(400).send({
                status: false,
                message: "product not Deleted !",
                response: deleteproduct
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(400).send({
            status: false,
            message: "Internal Server error!",
            response: crop
        })

    }
}

exports.getList = async (req, res) => {
    try {

        const token = req.user.userId

        const crop = await croplist_schema.find({ farmerId: token })
        if (crop) {
            return res.status(200).send({
                status: true,
                message: "croplist finded!",
                response: crop
            })
        } else {
            return res.status(400).send({
                status: false,
                message: "croplist not finded",
                response: crop
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(400).send({
            status: false,
            message: "Internal Server error!",
            response: crop
        })

    }
}


exports.getposteddata = async (req, res) => {
    try {

        const token = req.user.userId

        const { search, district } = req.query



        let matchStage = {};

        if (district) {
            matchStage.district = { $regex: district, $options: "i" };
        }
        if (search) {
            matchStage.cropName = { $regex: search, $options: "i" };
        }


        const crop = await croplist_schema.aggregate([
            { $match: matchStage },
            {
                $lookup: {
                    from: 'users',
                    foreignField: '_id',
                    localField: 'farmerId',
                    as: 'listwith_user'
                }
            },
            { $sort: { createdAt: -1 } }
        ])
        if (crop) {
            return res.status(200).send({
                status: true,
                message: "croplist finded!",
                response: crop
            })
        } else {
            return res.status(400).send({
                status: false,
                message: "croplist not finded",
                response: crop
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(400).send({
            status: false,
            message: "Internal Server error!",
            response: crop
        })

    }
}
