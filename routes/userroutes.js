const express = require('express')
const router = express.Router();
const multerUpload = require('../cloudinary/multerCloud.js')
const authMiddleware = require('../middleware/middleware.js')

const { createUser, findOneUser, updateUser,recentUser,alluser } = require('../controller/usercontroller.js')
const { createcrop, findallCrop, deleteCrop, updateCrop } = require('../controller/cropscontroller.js')
const { pushProfit, getProfit, deleteProfit, updateProfit, updateAllAmount, getallprofit,getprofitOnly } = require('../controller/crop_profitController.js')
const { addLabour, getall_labour, delete_labour, update_labour, emptythe_labour, labour_history } = require('../controller/labourcontroller.js')
//users
router.post('/users/register', createUser)
router.post('/users/login', findOneUser)
router.put('/users/update',multerUpload.single("profileImage"), authMiddleware, updateUser)
router.get('/users/topUser', recentUser)
router.post('/users/alluser', alluser)

// crops

router.post('/crops', authMiddleware, createcrop)
// router.get('/crops/:farmer_id', findallCrop)
router.get('/crops', authMiddleware, findallCrop)
router.delete('/crops/:crop_id', deleteCrop)
router.put('/crops/edit/:crop_id', updateCrop)

// crop_profit

router.put('/crops/profit/:crop_id', pushProfit)
router.get('/crops/profit/:crop_id', getProfit)
router.delete('/crops/profit/:crop_id/:expence_id', deleteProfit)
router.put('/crops/profit/expense/:crop_id/:expence_id', updateProfit)
router.put('/crops/profit/saled/:crop_id', updateAllAmount)
router.get('/getallprofit/', authMiddleware, getallprofit)
router.get('/getprofitonly/',  getprofitOnly)

// Labour

router.put('/crops/labour/:cropid', authMiddleware, addLabour)
router.get('/crops/labour/:cropid', getall_labour)
router.delete('/crops/labour/delete/:cropid', authMiddleware, delete_labour)
router.delete('/crops/labour/empty/:cropid', emptythe_labour)
router.put('/crops/labour/update/:cropid/:labourid', update_labour)
router.get('/crops/labour/history/:cropid/:labourIds', authMiddleware, labour_history)

module.exports = router