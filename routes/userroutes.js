const express = require('express')
const router = express.Router();
const multerUpload = require('../cloudinary/multerCloud.js')
const authMiddleware = require('../middleware/middleware.js')

const { createUser, findOneUser, updateUser, recentUser, alluser,allBuyers } = require('../controller/usercontroller.js')
const { createcrop, findallCrop, deleteCrop, updateCrop } = require('../controller/cropscontroller.js')
const { pushProfit, getProfit, deleteProfit, updateProfit, updateAllAmount, getallprofit, getprofitOnly } = require('../controller/crop_profitController.js')
const { addLabour, getall_labour, delete_labour, update_labour, emptythe_labour, labour_history } = require('../controller/labourcontroller.js')
const { createLists,updateLists,deleteLists, getList, getposteddata } = require('../controller/croplists_controller.js')
const { createCart, getCart, deleteCart, updateCart } = require('../controller/addToCartController.js')
const { createOrder, getOrders, getallOrders, cancelOrder } = require('../controller/ordercontroller.js')

const {otpverification,getOTP,Otpcheck}=require('../controller/notificationController.js')

//users
router.post('/users/register', createUser)
router.post('/users/login', findOneUser)
router.put('/users/update', multerUpload.single("profileImage"), authMiddleware, updateUser)
router.get('/users/topUser', recentUser)
router.post('/users/alluser', alluser)
router.post('/users/allBuyers', allBuyers)

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
router.get('/getprofitonly/', getprofitOnly)

// Labour

router.put('/crops/labour/:cropid', authMiddleware, addLabour)
router.get('/crops/labour/:cropid', getall_labour)
router.delete('/crops/labour/delete/:cropid', authMiddleware, delete_labour)
router.delete('/crops/labour/empty/:cropid', emptythe_labour)
router.put('/crops/labour/update/:cropid/:labourid', update_labour)
router.get('/crops/labour/history/:cropid/:labourIds', authMiddleware, labour_history)



// crop lists

router.post('/croplist', authMiddleware, createLists)
router.put('/croplist/:updateid', authMiddleware, updateLists)
router.delete('/croplist/:deleteid', authMiddleware, deleteLists)
router.get('/croplist', authMiddleware, getList)
router.get('/croplist/posted', authMiddleware, getposteddata)

// add to Cart

router.post('/cartlist', authMiddleware, createCart)
router.get('/cartlist', authMiddleware, getCart)
router.delete('/cartlist/:id', authMiddleware, deleteCart)
router.put('/cartlist/:id', authMiddleware, updateCart)


// orders
router.post('/orders', authMiddleware, createOrder)
router.get('/orders', authMiddleware, getOrders)
router.get('/allorders', authMiddleware, getallOrders)
router.delete('/cancelOrder', cancelOrder)

// notification

router.post('/OTP', otpverification)
router.get('/OTP/:id',authMiddleware, getOTP)
router.post('/verifyOTP', Otpcheck)

module.exports = router