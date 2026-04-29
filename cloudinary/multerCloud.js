const multer = require('multer')
const { CloudinaryStorage  } = require('multer-storage-cloudinary')
const cloudinary = require('./cloudinary.js')


const storage = new CloudinaryStorage ({
    cloudinary,    // use my config(API key...)
    params: {
        folder: "profile_images",   // folder name in cloudinary 
        allowed_formats: ["jpg", "png", "jpeg"]
    }
})

const upload = multer({ storage });

module.exports = upload;