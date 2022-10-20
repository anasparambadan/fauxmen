const { response } = require('express');
const { default: mongoose } = require('mongoose');
const addressModel = require('../model/address_model')


module.exports = {

  addAddress: (addressData, userid) => {
    return new Promise(async (resolve, reject) => {
      console.log(userid, 'this is userid');
      console.log(addressData, 'this is userid');
      const address = await addressModel.findOne({ userId: userid })
      if (!address) {
        const address = new addressModel({
          userId: userid,
          addresses: addressData
        }).save().then((response) => {
          console.log(response, 'hhhhhhiioiioiiohoih')
          resolve(response)
        })
      } else {
        await addressModel.findOneAndUpdate({ userId: userid }, { $push: { addresses: addressData } }).then((response) => {
          resolve(response)
        })
      }

    })
  },

  getAddress: (userid) => {
    return new Promise((resolve, reject) => {
      try {
        addressModel.findOne({ userId: userid }).lean().then((response) => {
         
          resolve(response)
        }).catch((err) => {
          reject(err);
        })

      } catch (error) {
        reject(error)
      }
    })
  },
  
  removeAddresss: (userId, addressID) => {
    console.log(addressID, "adaddadadadadadad")

    return new Promise(async (resolve, reject) => {
      await addressModel.findOneAndUpdate({ userId: userId },
        {
          $pull:

          {
            addresses:
            {
              _id: addressID
            }
          }

        }).then((response) => {
          resolve(response)

          console.log(response, 'deletedddddddddddddddddd');
        })
    })

  },

  updateAddress: (addressId, addressData) => {
    console.log(addressId, 'this is addressid')
    console.log(addressData, 'this is addressid')
    return new Promise(async (resolve, reject) => {
      await addressModel.findOneAndUpdate({ 'addresses._id': addressId }, {
        '$set':
        {
          'addresses.$.name': addressData.name,
          'addresses.$.housename': addressData.housename,
          'addresses.$.villageorcity': addressData.villageorcity,
          'addresses.$.apartment': addressData.apartment,
          'addresses.$.postoffice': addressData.postoffice,
          'addresses.$.district': addressData.district,
          'addresses.$.state': addressData.state,
          'addresses.$.pin': addressData.pin,
          'addresses.$.landmark': addressData.landmark,
          'addresses.$.mobile': addressData.mobile,
        }
      }).then((response) => {
        console.log(response, 'klkklklklk')

        resolve(response)
      }).catch((err) => {
        console.log(err, 'this error founded at addressController');
        reject(err);
      })
    })
  },
  getAddressData: (userid, addressId) => {
    console.log(addressId, 'this is address id ');
    return new Promise((resolve, reject) => {
      try {
        //addressModel.findOne({_id:addressId}).lean().then((response) => {
        addressModel.findOne({ userId: userid }, { addresses: 1 }).lean().then((response) => {
          // console.log(response,'single addressa   ,,,,,');


          let myAddress = response.addresses.find(address => {
            console.log(address._id.toString())
            return address._id.toString() == addressId
          })

          // console.log("hi:--------",myAddress)
          // console.log("sssssssssssssssssssssssssssssssssssssssssssssss")
          // const x =  response.addresses.filter((data)=>{
          //   data._id == mongoose.Types.ObjectId(addressId)
          // })

          // console.log(x, 'this is the single adderss by person');
          resolve(myAddress);
          
        })
      } catch (error) {
        reject(error)
      }
    })
  }



}




// const { response } = require('express')
// const addressmodel = require('../model/address_model')



// module.exports = {
//     addaddress:(addressdata,userid)=>{
//         return new Promise(async(resolve,reject)=>{

//             try{

//                 let address = await new addressmodel({
//                     address:{
//                         name:addressdata.name,
//                         housename:addressdata.housename,
//                         area:addressdata.area,
//                         district:addressdata.district,
//                         state:addressdata.state,
//                         pin:addressdata.pin,
//                         phone:addressdata.phone,
//                         email:addressdata.email
//                     },
//                     userId:userid
//                 })
//                 address.save().then((response)=>{
//                     resolve(response);

//                 })

//             }

//             catch(err){
//                 reject(err)

//             }
//         })
//     },

//     getaddress:(userid)=>{

//         return new Promise((resolve,reject)=>{

//             try{
//                 addressmodel.find({userId:userid}).lean().then((response)=>{
//                     resolve(response)
//                     console.log(response,'this is addess response at get all addresses addresscontroller')

//                 }).catch((err)=>{
//                     reject(err)
//                 })

//             }
            
//             catch(err){
//                 reject(err)

//             }
//         })
        
//     },

//     deleteaddress:(addressId)=>{
//         return new Promise(async(resolve,reject)=>{
//             try{
//                 await addressmodel.findByIdAndDelete({_id:addressId}).then((response)=>{
//                     resolve(response)
//                 })
//             }
//             catch(err){
//                 reject(err)

//             }
//         })
//     },

//     updateaddress:(addressId,addressdata)=>{
//         return new Promise(async(resolve,reject)=>{
//             await (await addressmodel.updateOne({_id:addressId})).matchedCount((response)=>{
//                 resolve(response)
//             }).catch((err)=>{
//                 console.log(err,"error at addresscontroller");
//                 reject(err)
//             })

//         })
//     },

//     getaddressdata:(addressId)=>{
//         return new Promise((resolve,reject)=>{
//             try{
//                 addressmodel.find({_id:addressId}).populate('address').lean().then((response)=>{
//                     resolve(response)
//                     console.log(response,'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
//                 })

//             }
//             catch(err){
//                 reject(err)
//             }
//         })
//     }
// }
