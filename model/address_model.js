const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

const addressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    require: true
  },

    addresses: [{
      name:String,
      housename: String,
      villageorcity: String,
      apartment:String,
      postoffice: String,
      district: String,
      state:String,
      pin: Number,
      mobile: Number,
      landmark: String
    }]

},
  { timestamps: true }
);
const addressModel = mongoose.model('addresses', addressSchema);
module.exports = addressModel;



// const mongoose = require('mongoose')

// const addressSchema = new mongoose.Schema({
 
//     userId:{
//         type:mongoose.Schema.Types.ObjectId,
//         ref:'users',
//         require:true
//     },
//     address:{
//         name:String,
//         housename:String,
//         area:String,
//         district:String,
//         state:String,
//         pin:Number,
//         phone:Number,
//         email:String
//     }
    

// })  

// const addressmodel =mongoose.model('addresses', addressSchema)
// module.exports=addressmodel;

