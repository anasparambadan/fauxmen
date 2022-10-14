const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        require: true
    },
    orderitems: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'products',
        },
        quantity: 'number'

    }],


    addressId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'address',
        require: true
    },

    OrderStatus: {
        type: String
    },
    paymentMethod: {
        type: String
    },
    totalamount: {
        type: Number
    },
    deliveryStatus: {
        type: String
    },

    productStatus: {
        type: String
    },

    discount: {
        type: Number
    },
    coupon: {
        type: String
    }, date: {
        type: String
    },
    grandtotal:{
        type:Number
    },
    totaldiscount:{
        type:Number
    }


},
    { timestamps: true }
);
const addressModel = mongoose.model('order', userSchema);
module.exports = addressModel;