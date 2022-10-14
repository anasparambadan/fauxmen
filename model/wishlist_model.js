const mongoose =  require('mongoose')

const WishlistSchema = mongoose.Schema({
    userId :{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
        // require:true
    },
    Wishlistdata:[{
        productId:{
          type:mongoose.Schema.Types.ObjectId,
          ref:'products',
        //   require:true

        }
    }]
},{timestamps:true})


const wishlistmodel = mongoose.model('wishlists',WishlistSchema)

module.exports = wishlistmodel;

// const mongoose = require('mongoose')

// const wishlistSchema = new mongoose.Schema({
 
//     userId:{
//         type:mongoose.Schema.Types.ObjectId,
//         ref:'users',
//         require:true
//     },
//     wishlistdata:[
//         {productId:{
//             type:mongoose.Schema.Types.ObjectId,
//             ref:'products',
//             require:true
//         }
       
//     }]
    

// },{timestamps:true})

// const wishlistmodel =mongoose.model('wishlists', wishlistSchema)
// module.exports=wishlistmodel;

