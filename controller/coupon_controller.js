
const { promise } = require("bcrypt/promises");
const async = require("hbs/lib/async")
const couponmodel = require("../model/coupon_model")
const cart_controller = require('../controller/cart_controller')


module.exports={
    addcoupon:(coupondata)=>{
        console.log(coupondata,'.....................coupondataaaaaaaaaaa');
        return new Promise((resolve,reject)=>{
            const coupon = new couponmodel({
                Couponname:coupondata.Couponsname,
                Couponcode:coupondata.Couponscode,
                Discountprice:coupondata.Discountsprice,
                Discountpricelimit:coupondata.Discountpriceslimit,
                Couponlimit:coupondata.Couponslimit,
                Date:coupondata.Dates
            })
            coupon.save().then((newcoupon)=>{
                console.log(newcoupon,'n0000000000000----ew coupon');
                resolve(newcoupon)
            })
        })
    },

    allcoupons:()=>{
        return new Promise(async(resolve,reject)=>{
            let response={}
            let coupon = await couponmodel.find({}).lean()
            response = coupon
            resolve(response)

        })
    },
    coupondelete:(cpnid)=>{
        return new Promise((resolve,reject)=>{
            couponmodel.findByIdAndDelete({_id:cpnid}).then((response)=>{
                resolve(response)
            })
        })

    },

    applycoupon:(coupondata,userid)=>{
        console.log(coupondata,'coupondata@couponcontroller,,,,,,,,,,,,,');
        console.log(userid,'useruseruseruseridddddddddddd,,,,,,,,,,,,,,,,,,,,,,,,,,,');
        return new Promise(async(resolve,reject)=>{
            try{
                let response ={}
                let coupon = await couponmodel.findOne({Couponcode:coupondata.code})
                console.log(coupon,'coupon at applycoupon controller...............');
                cart_controller.gettotalamount(userid).then(async(totalamount)=>{
                    
                    let total = totalamount.total
                    let totalmrp = totalamount.totalmrp
                    console.log(total,totalmrp,'total@/./../././/caoupenecontorller,total mrp');
                    console.log();
                    if(coupon){
                        
                        response.coupon = coupon
                        let couponuser = await couponmodel.findOne({Couponcode:coupondata.code, userId:{$in:[userid]}})
                        console.log(couponuser,'couponuser find at applycoupon controller.......................')
                        if(coupon.Discountpricelimit <= total){
                            let coupon_discountprice = coupon.Discountprice
                            response.status = true;
                            if(couponuser){
                                response.status=false
                                console.log(response,'response if couponuser is found.........................')
                                resolve(response)
                            }
                            else{
                                response.coupon_discount = coupon_discountprice
                                let coupon_grandetotal = total - coupon_discountprice
                                response.coupon_grandetotal = coupon_grandetotal 
                                console.log(response,'response if couponuser is noooooootttt found.........................')
                                resolve(response)
                            }



                        }
                        else{
                            response.status = false
                            resolve(response)
                        }
                    }
                    else{
                        response.status=false
                    }
                })
                
            }
            catch(error){
                reject(error)



            }
        })
    },


    couponUser:(userid,coupon)=>{
        return new Promise(async(resolve,reject)=>{
            try{
                let coupons = await couponmodel.findOne({Couponcode:coupon.code})
                await couponmodel.findByIdAndUpdate(coupons._id,{$push:{useId:userid}}).then((response)=>{
                    resolve(response)
                })

            }
            catch(error){
                reject(error)

            }

        })
    }


}