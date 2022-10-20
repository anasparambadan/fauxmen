const mongoose = require('mongoose')

const CouponSchema = new mongoose.Schema({
  userId: [{
    type:mongoose.Schema.Types.ObjectId,
    ref: 'users'
  }],
  Couponname: {
    type: String
  },
  Couponcode: {
    type: String
  },
  Discountprice: {
    type: 'number'
  },
  Discountpricelimit:{
    type: 'number'
  },
  Couponlimit: {
    type: 'number'
  },
  Date: {
    type: Date
  }

})
const couponmodel = mongoose.model('coupon', CouponSchema)

module.exports = couponmodel