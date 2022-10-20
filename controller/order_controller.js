const orderModel = require('../model/order_model');
const cartController = require('../controller/cart_controller');
const addressController = require('../controller/address_controller');
const cartmodel = require('../model/cart_model');
const { findOneAndUpdate } = require('../model/admin_model');





module.exports = {

  placeOrder: (orderdata, userid, coupon) => {


    console.log(orderdata, 'this is orderdata')

    return new Promise(async (resolve, reject) => {
      try {
        console.log(orderdata.billtype, '......paymentMethod')
        if (orderdata.billtype === 'COD') {
          OrderStatus = true;
        }



        cartController.gettotalamount(userid).then((totalcart) => {
          console.log(totalcart, 'this is response of total');
          let total = totalcart.total
          console.log(total,'...........totla at order controllers ...............');
          // if (orderdata.discount) {
          //   response = response - orderdata.discount;
          // }


          cartController.addproductdetails(userid).then((productdetails) => {
            var today=new Date()
            var newdate=today.toISOString()
            newdate=newdate.slice(0,10);

            console.log(productdetails, 'this is cart details @ place order');

            if (coupon) {
              console.log(coupon.coupon_discount,'coupon discount.........');
              const newOrder = new orderModel({

                userId: userid,
                orderitems: productdetails.cart.cartdata,
                addressId: orderdata.address,
                OrderStatus: true,
                paymentMethod: orderdata.billtype,
                totalamount: total,
                deliveryStatus: 'Pending',
                productStatus: 'Pending',
                grandtotal: coupon.coupon_grandetotal,
                date: newdate,
                Coupon: coupon.coupon_discount

              })
  
              newOrder.save().then(async (newOrder) => {
                await cartmodel.findOneAndDelete({ userId: userid }).then((response) => {
  
  
                  resolve(newOrder);
                  console.log(newOrder, '..................new order')
               })
              })

            }
            else {
              const newOrder = new orderModel({

                userId: userid,
                orderitems: productdetails.cart.cartdata,
                addressId: orderdata.address,
                OrderStatus: true,
                paymentMethod: orderdata.billtype,
                totalamount: total,
                deliveryStatus: 'Pending',
                productStatus: 'Pending',
                grandtotal: total,
                date: newdate,
              })
  
              newOrder.save().then(async (newOrder) => {
                await cartmodel.findOneAndDelete({ userId: userid }).then((response) => {
  
  
                  resolve(newOrder);
                  console.log(newOrder, '..................new order')
                })
              })

            }


           
          })

        })

      } catch (error) {
        reject(error);
      }
    })
  },

  myOrders: (userid) => {
    console.log(userid, 'is the userid')
    return new Promise(async (resolve, reject) => {
      try {
        await orderModel.find({ userId: userid }).populate('orderitems.productId').lean().then((response) => {
          console.log(response);
          resolve(response);


        })
      } catch (error) {
        reject(error);
      }
    })
  },

  myOrderslim: (userid) => {
    console.log(userid, 'is the userid')
    return new Promise(async (resolve, reject) => {
      try {
        await orderModel.find({ userId: userid }).sort({createdAt:-1}).limit(5).populate('orderitems.productId').lean().then((response) => {
          console.log(response);
          resolve(response);


        })
      } catch (error) {
        reject(error);
      }
    })
  },

  getOrder: (orderid) => {
    return new Promise((resolve, reject) => {
      try {
        orderModel.find({ _id: orderid }).lean().then((response) => {
          console.log(response, '.....this is the orders');
          resolve(response)
        })
      } catch (error) {
        reject(error)
      }
    })
  },


  getTrack: (orderid) => {
    return new Promise(async (resolve, reject) => {
      try {
        await orderModel.findOne({ _id: orderid }).populate('orderitems.productId').populate('userId').lean().then((response) => {
          console.log(response, '.........tracking .........')
          resolve(response);
        })
      } catch (error) {
        console.log('error founded:', error);
        reject(error);
      }
    })
  },

  allOrders: () => {
    return new Promise(async (resolve, reject) => {
      try {
        await orderModel.find().lean().populate('orderitems.productId').populate('userId').sort({createdAt:-1}).then((response) => {
          resolve(response);
        })
      } catch (error) {
        reject(error)
      }
    })
  },

  cancelorder:(orderid)=>{
    return new Promise(async(resolve,reject)=>{
      try{
        await orderModel.findByIdAndUpdate({_id:orderid},{productStatus:'Cancelled',deliveryStatus:'Returning'}).then((response)=>{
          resolve(response)
        })


      }
      catch(error){
        reject(error)
      }
    })
  },

  shiporder:(orderid)=>{
    return new Promise(async(resolve,reject)=>{
      try{
        await orderModel.findByIdAndUpdate({_id:orderid},{productStatus:'Shipped',deliveryStatus:'Shipped'}).then((response)=>{
          resolve(response)
        })


      }
      catch(error){
        reject(error)
      }
    })
  },
  delivered:(orderid)=>{
    return new Promise(async(resolve,reject)=>{
      try{
        await orderModel.findByIdAndUpdate({_id:orderid},{productStatus:'Delivered',deliveryStatus:'Delivered'}).then((response)=>{
          resolve(response)
        })


      }
      catch(error){
        reject(error)
      }
    })
  },

  salestoday: () => {
    var today=new Date()
            var newdate=today.toISOString()
            newdate=newdate.slice(0,10);
            let response ={}

    return new Promise(async (resolve, reject) => {
      try {
        await orderModel.find({date:newdate}).lean().populate('orderitems.productId').populate('userId').then((todayorder) => {
         let ordertoday = todayorder
         let todayrsale = ordertoday.reduce((accumulator,object)=>{
          return accumulator + object.grandtotal
         },0) 
         console.log(todayrsale,'revenue today.,.,.,.,.,.,.,.,.,.,')
         response.orderstoday = ordertoday
         response.todaysale = todayrsale

          resolve(response);
        })
      } catch (error) {
        reject(error)
      }
    })
  },

  ordersAll: () => {
    return new Promise(async (resolve, reject) => {
      let response={}
      try {
        await orderModel.find().lean().populate('orderitems.productId').populate('userId').then((allorders) => {
          console.log(allorders,'...................all ordres');
          orderModel.find({productStatus:"Cancelled"}).lean().then((cancelled)=>{
            orderModel.find({deliveryStatus:"Delivered"}).lean().then((delivered)=>{
              orderModel.find({paymentMethod:"COD"}).lean().then((cod)=>{
                orderModel.find({paymentMethod:"onlinepayment"}).lean().then((online)=>{
                  let allsale = allorders.reduce((accumulator,object)=>{
                    return accumulator + object.grandtotal
                   },0) 
                   totalorderscount = allorders.length
                   response.allorders = allorders
                   response.allsale = allsale
                   response.ordercount = totalorderscount
                   response.cancelledorders = cancelled.length
                   response.deliveredorders = delivered.length
                   console.log(totalorderscount,'alll count........');
          
                    resolve(response);
                  codcount = cod.length
                  onlinecount= online.length
                  response.cod = codcount
                  response.online=onlinecount
                })
              })
                
        

            })
          })
          
        
        })
      } catch (error) {
        reject(error)
      }
    })
  },

  stati:()=>{
    return new Promise(async(resovle,reject)=>{
      try{

        var dateArray =[]
        for(let i = 0;i<5;i++){
            var d = new Date();
            d.setDate(d.getDate()-i)
            var newdate = d.toISOString()
            // console.log(new Date());
            newdate = newdate.slice(0,10)
            dateArray[i] = newdate
        }
        console.log(dateArray,newdate,'jkjhkjhkjhkjh');
        // var Date = new Date()    

        var dateSale =[]
        // var date = new Date() 
        for(i = 0; i <5; i++){
            // dateSale[i] = await ordermodel.find({newdate:dateArray[i]}).lean().count()
            dateSale[i] = await orderModel.find({date:dateArray[i]}).lean().count()
            console.log(   dateSale[i] ,"dateeeeeee");
        }
        var status = {
            dateSale:dateSale,
            dateArray:dateArray
        }
        resovle(status)
        } catch(error){
            console.log("error",error);
      }
    })
  }
    



  

}

