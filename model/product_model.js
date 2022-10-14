const mongoose = require('mongoose')
const Schema = mongoose.Schema
const addproductSchema = new mongoose.Schema({
    productname:{
        type:String
    },
    brand:{
        type:String
    },
    price:{
        type:Number
    },
    discountprice:{
        type:Number
    },
    percentage:{
        type:Number
    },
    categoryname:{
        type:Schema.Types.ObjectId,
        ref:'categories'
    },
    stock:{
        type:Number
    },
    image:{
        type:Array
    },
    description:{
        type:String
    }

},{timestamps:true})

const productmodel =mongoose.model('products', addproductSchema)
module.exports=productmodel;

