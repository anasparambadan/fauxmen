const { promise } = require('bcrypt/promises');
const async = require('hbs/lib/async');
const wishlistmodel = require('../model/wishlist_model')

module.exports={
    addwishlist:(userid,productid)=>{
        console.log(userid,"wishlist useriddd");
        console.log(productid,"wishlist prooos id");
        const response = {
            duplicate:false
        }
        return new Promise (async(resolve, reject)=>{
            try{
                let wishlist = await wishlistmodel.findOne({userId :userid})
                if(wishlist){
                    let wishproducts = await wishlistmodel.findOne({
                        userId :userid,
                        "Wishlistdata.productId" : productid
                    })
                    console.log(wishlist,"iiiiiiiiiiiiiiiii");
                    if(wishproducts){
                        // wishlist.updateOne(
                        //     {userId : userid, "Wishlistdata.productId" : productid}
                    // ).then((response)=>{
                            response.duplicate = true;
                            resolve(response)
                        } else {
                            let wishArry = { productId : productid };
                            wishlistmodel.updateOne({userId : userid},{ $push  :{Wishlistdata: wishArry }
                            }).then((response)=>{
                                console.log(response.duplicate,"kkkkkkkkkk");
                                resolve(response)
                            });
                        } 
                    
                     
                    }else {
                        let wishlistobj  = new wishlistmodel({
                            userId : userid,
                            Wishlistdata:[{productId:productid}],
                        })
                        wishlistobj.save().then((response)=>{
                            console.log("wishlist response",response);
                            resolve(response)
                        }).catch((err)=>{
                            console.log("error",err);
                        })

                        }
                        
                    }catch (error){
                        reject(error)
                        }
                    })
                    
                    
                    },
                
                
                 
                

    additems:(userid)=>{
        try{
        return new Promise(async(resolve, reject)=>{
            const response={}
            wishlistmodel.findOne({userId : userid}).populate('Wishlistdata.productId').lean().then((list)=>{
                console.log("babbbbb",list);
                   if(list){
                    if(list.Wishlistdata.length >0){
                        response.wishlistempty = false;
                        response.list = list
                        resolve(response)
                    }else{
                        response.wishlistempty = true
                        response.list = list
                        resolve(response)
                    }
                   }else{
                    response.wishlistempty = true
                    resolve(response)
                   }
            })
        })
    }catch(error){
        reject(error)
    }
    },

    deleteitem:(userid,productid)=>{
            return new Promise(async(resolve,reject)=>{
                try{
      await wishlistmodel.updateOne({userId : userid},
        {$pull:{Wishlistdata:{productId : productid}}
    }).then((response)=>{
        resolve(response)
    })
    }catch(err){
        reject(err)
    }
        })
    },
    itemcount:(userid)=>{
        return new Promise(async(resolve,reject)=>{
            let count = 0
            let items = await wishlistmodel.findOne({userId: userid})
            if(items){
                count = items.Wishlistdata.length

            }
            console.log(count,"tharaaaaaa");
            resolve(count)
        })
    }






            }



// const wishlist_model = require('../model/wishlist_model')


// let helpers = {
//     addtowishlist:(productid,userid)=>{
//         const response = {
//             duplicate : false
//         };
//         console.log(productid,'..........productid...........',userid,'........userid..............');
        
//         return new Promise(async(resolve,reject)=>{
//             try{
//                 let userwishlist = await wishlist_model.findOne({userId:userid});
//                 console.log(userwishlist,'user wishlist');
//                 if(userwishlist){
//                     let wishlistproduct = await wishlist_model.findOne({
//                         userId:userid,
//                         "wishlistdata.productId":productid,
//                     });
                    
//                     // if(wishlistproduct){
//                     //     console.log(cartproduct,'cartproduct');
//                     //     cart_model.updateOne({userId:userid,"cartdata.productId":productid},{$inc:{"cartdata.$.quantity": 1}})
//                     //     .then((response)=>{
//                     //         response.duplicate = true
//                     //         resolve(response)
//                     //     })

//                     // }
//                     // else{
//                     //     let cartArray = {productId:productid, quantity:1};
//                     //     cart_model.findOneAndUpdate({userId:userid},{$push:{cartdata:cartArray}})
//                     //     .then((data)=>{
//                     //         resolve(response);
//                     //     });
//                     // }
//                 }
//                 else{
//                     let body = {
//                         userId:userid,
//                         wishlistdata:[{productId:productid}],
//                     };
//                     await wishlist_model.create(body)
//                 }

//             }
//             catch(error){
//                 reject(error)

//             }
//         })
//     },




//     wishlistdetails: (userid)=>{
//         try{

//             return new Promise((resolve,reject)=>{
//                 const response = {}
//                 wishlist_model.findOne({userId:userid}).populate('wishlistdata.productId').lean().then((wishlist)=>{
//                     console.log(wishlist,'this is wishlist');
//                     if(wishlist){
//                         if(wishlist.wishlistdata.length > 0){
//                             response.wishlistempty = false;
//                             response.wishlist = wishlist;
//                             resolve(response)
//                         }
//                         else{
//                             response.wishlistempty = true;
//                             response.wishlist = wishlist;
//                             resolve(response)
//                         }
//                     }
//                     else{
//                         response.wishlistempty = true;
//                         resolve(response)
//                     }

//                 })

//             })

//         }
//         catch(error){
//             reject(error)
//             console.log('error');


//         }

//     },

//     deletewishlist:(userid,productid)=>{
//         console.log('userid',userid,'productid',productid)
//         return new Promise(async(resolve,reject)=>{
//             try{
//                 await wishlist_model.updateOne({userId:userid},{$pull:{wishlistdata:{productId:productid}}}).then((response)=>{
//                     console.log(response);
//                     resolve(response)
//                 })

//             }
//             catch(err){
//                 reject(err)

//             }
//         })

//     }
// }

// module.exports = helpers