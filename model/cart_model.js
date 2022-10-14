const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
 
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
        require:true
    },
    cartdata:[
        {productId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'products',
            require:true
        },
        quantity:'number'
       
    }]
    

},{timestamps:true})

const cartmodel =mongoose.model('carts', cartSchema)
module.exports=cartmodel;

