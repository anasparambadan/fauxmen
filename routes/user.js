var express = require('express');
var router = express.Router();
const usermodel = require('../model/user_model')
const user_controller = require('../controller/user_controller')
const session = require('express-session')
const twilio_controller = require('../controller/twilio_controller')
const usermiddlewareu = require('../middleware/user_middleware')
const product_controller = require('../controller/product_controller');
const { response } = require('../app');
const cart_controller = require('../controller/cart_controller')
const wishlist_controller = require('../controller/wishlist_controller');
const { TrustProductsEntityAssignmentsContext } = require('twilio/lib/rest/trusthub/v1/trustProducts/trustProductsEntityAssignments');
const address_controller = require('../controller/address_controller');
const order_controller = require('../controller/order_controller')
const payment_controller = require('../controller/payment_controller');
const banner_controller = require('../controller/banner_controller');
const coupon_controller = require('../controller/coupon_controller');
const category_controllerl = require('../controller/category_controllerl');



/* GET home page. */
let username
let cartcount

router.get('/', usermiddlewareu.isblocked, function (req, res, next) {
  if (req.session.loggedin) {
    banner_controller.getbannerdata().then((banners) => {
      console.log(banners, 'banner dataaaa................[[[[[]]]]]]]]]]')
      username = req.session.username
      userid = req.session.user._id
      cart_controller.cartcount(userid).then((countcart) => {
        product_controller.getPoductdetailslim().then((response) => {
          category_controllerl.getcategory().then((catdata) => {
            console.log(catdata, 'category data......');
            cartcount = countcart
            res.render('user/user-home', { user: true, loggedin: req.session.loggedin, banners, username, cartcount, response, catdata });

          })
        })
      })
    })

  }
  else {
    banner_controller.getbannerdata().then((banners) => {
      product_controller.getPoductdetailslim().then((response) => {
        category_controllerl.getcategory().then((catdata) => {
      username = req.session.username
      res.render('user/user-home', { user: true, loggedin: req.session.loggedin, banners, username,response, catdata });
    })
  })
})

  }


});



let verifylogin = (req, res, next) => {

  if (req.session.user) {
    userid = req.session.user._id
    console.log(userid, '//////....usr id at varerify login');
    cart_controller.cartcount(userid).then((countcart) => {
      cartcount = countcart
      console.log(cartcount, 'cart cart count at verifylogin');
      next();
    })

  }
  else {
    res.redirect('/login')
  }
}


/*=========================user sign in ========================*/



router.get('/login', function (req, res, next) {

  if (req.session.loggedin) {
    if (req.session.blockeduser) {
      res.render('user/login-user', { blocked: req.session.blockeduser })
      req.session.destroy()


    }
    else {
      res.redirect('/')
    }

  } else {
    let logginerror = req.session.logginerror
    res.render('user/login-user', { logginerror });
  }

});

//================  session distroy  ==================//

router.get('/logout', function (req, res, next) {
  req.session.destroy()
  res.redirect('/');
});



//====================  user login post methode===============//

router.get('/user-home', function (req, res, next) {

  res.render('user/user-home', { user: true });
});


router.post('/login', (req, res, next) => {
  user_controller.userlogin(req.body).then((response) => {
    req.session.email = response.email
    console.log(response.email, 'login respnse email');
    console.log('=user req.body', req.body);

    if (response.status) {

      req.session.loggedin = true
      req.session.user = response.user
      req.session.username = response.user.name
      console.log(req.session.user, 'user sessoonnnnnnn')

      console.log("login success");
      res.redirect('/')
    }
    else if (response.usernotfound) {
      req.session.logginerror = true

      console.log("user not found");
      res.redirect('/login')
    }
    else {
      console.log("user login failed");

      res.redirect('/login')
    }
  })
});

/* ================ User signup ================= */

router.get('/signup', function (req, res, next) {
  if (req.session.loggedin) {

    res.redirect('/')
  }
  else {
    res.render('user/signup-user', { exist: req.session.user });
  }

});


router.post('/signup', (req, res) => {

  user_controller.usersignup(req.body).then((state) => {
    if (state.userexist) {
      req.session.userAlreadyExist = true;
      res.redirect('/signup');
    } else {
      req.session.user = state.user;
      req.session.email = state.email;
      req.session.loggedin = true;
      req.session.username = state.name
      let uname = req.session.username
      console.log(uname, 'u name...........[][]][][][]][][][');
      console.log(state.user);
      console.log('user');
      //res.redirect('/')

      req.session.phonenumber = req.body.phonenumber
      twilio_controller.getOtp(req.body.phonenumber).then((response) => {



        if (response.exist) {
          if (response.ActiveStatus) {
            req.session.user = response.user
            console.log(response.email);
            req.session.email = response.email

            res.render('user/otp_verify')
          }

        }
      })
    }
  })

})

router.post('/otpverify', (req, res) => {
  console.log(req.session.phonenumber);
  twilio_controller.checkOut(req.body.otp, req.session.phonenumber).then((response) => {

    console.log(response);
    if (response == 'approved') {
      // console.log(response.status);
      // req.session.user = true;

      req.session.loggedin = true
      //userModel.findOneAndUpdate({mobile:req.session.phonenumber},{verified:true}
      user_controller.updateuserverify(req.session.phonenumber).then((response) => {
        console.log(response);
        res.redirect('/')
      }
      )

    } else {
      res.render('user/otp_verify')
    }
  })
})


// ............product.................//

router.get('/shop', (req, res) => {

  product_controller.getPoductdetails().then((response) => {
    category_controllerl.getcategory().then((catdata) => {
      console.log(catdata, 'category data......');
      res.render('user/list_product', { loggedin: req.session.loggedin, username: req.session.username, response, catdata, user: true, cartcount })

    })


  })
})

router.get('/shop_catgry/:_id', (req, res) => {
  let catid = req.params._id
  product_controller.getCatProducts(catid).then((response) => {
    category_controllerl.getcategory().then((catdata) => {
      res.render('user/list_product', { loggedin: req.session.loggedin, username: req.session.username, response, user: true, catdata, cartcount })



    })

  })
})


//.............single product view .............//



router.get('/single_product/:id', (req, res) => {
  let productID = req.params.id
  product_controller.getPoductvalue(productID).then((productData) => {
    console.log(productData, 'product data category.....................');
    res.render('user/single_product', { productData, user: true, loggedin: req.session.loggedin, username: req.session.username, cartcount })

  })



})









// ...................cart.......................... //





router.get('/cart', verifylogin, (req, res) => {

  userid = req.session.user._id
  console.log(userid, 'user id at /cart');
  cart_controller.addproductdetails(userid).then((productdetails) => {
    // console.log(productdetails,"hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh")
    cart_controller.cartcount(userid).then((cartcounts) => {
      cart_controller.gettotalamount(userid).then((totalamount) => {
        let cartempty = productdetails.cartempty
        // console.log(totalamount,'cart total amont');

        if (!cartempty) {
          cartdetails = productdetails.cart.cartdata
          carttotal = totalamount
          cartitemsnum = cartcounts
        }



        res.render('user/user_cart', { loggedin: req.session.loggedin, username: req.session.username, productdetails, cartcount, totalamount, user: true, cartempty })
      })
    })
  })





})



router.post('/addtocart/:_id', verifylogin, (req, res) => {
  //cart_controller.addproductdetails(req.session.user._id).then((productdetails) => {
    cart_controller.addtocart(req.params._id, req.session.user._id).then((response) => {
      // console.log(productdetails,'productdetalis addtocartpost');
      cart = response.cart
      cartempty = response.cartempty
      res.json(response)
    })
  })
//})

router.get('/deletecart/:_id', verifylogin, (req, res) => {
  let userid = req.session.user._id
  let productid = req.params._id
  cart_controller.deletecart(userid, productid).then((response) => {
    // console.log(response);
    res.redirect('/cart')
  })
})


router.post('/incrementqty/:_id', verifylogin, (req, res) => {
  let userid = req.session.user._id
  let productid = req.params._id
  cart_controller.incrementqty(userid, productid).then((response) => {
    res.json(response)
  })
})

router.post('/decrementqty/:_id', verifylogin, (req, res) => {
  let userid = req.session.user._id
  let productid = req.params._id
  cart_controller.decrementqty(userid, productid).then((response) => {
    res.json(response)
  })
})

//--------user profile----------//

router.get('/profile', (req, res) => {

  if (req.session.loggedin) {
    User = req.session.user._id
    console.log(User, "useeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeer");
    user_controller.getuserdetails(User).then((userDetails) => {
      address_controller.getAddress(User).then((address) => {
        order_controller.myOrderslim(User).then((orders) => {
          console.log(orders, 'orders...profile///.......');
          res.render('user/profile', { user: true, User, cartcount, userDetails, loggedin: req.session.loggedin, username: req.session.username, address, orders })

        })
      })


    })
  }
  else {
    res.redirect('/')
  }



})

router.post('/user/updateuser:id', (req, res) => {
  let userid = req.params.id
  user_controller.updateuser(userid, req.body).then((userdata) => {
    req.session.user = userdata
    res.redirect('/profile')
  }).catch((error) => {
    next(error)
  })
})



//..........wishlist......//

router.get("/wlist", verifylogin, (req, res) => {
  (userid = req.session.user._id), (producutid = req.params.id);
  wishlist_controller.additems(userid).then((items) => {
    wishlist_controller.itemcount(userid).then((itemscount) => {
      cart_controller.cartcount(userid).then((cartCount) => {
        res.render("user/wishlist", { items, itemscount, cartcount, cartCount, user: true, loggedin: req.session.loggedin, username: req.session.username, });
      });
    });
  });
});


router.post("/wishlist/:_id", verifylogin, (req, res) => {
  console.log(req.session.user._id, req.params._id, "idddddddss");
  wishlist_controller
    .addwishlist(req.session.user._id, req.params._id)
    .then((response) => {
      console.log(response, "wishlisttttttttt");
      wishlistempty = response.wishlistempty;
      wishlist = response.wishlist;
      // res.redirect('/Wlist')
      res.json(response);
    });
});
router.get("/deleteitem/:id", verifylogin, (req, res) => {
  userid = req.session.user._id;
  productid = req.params.id;
  wishlist_controller.deleteitem(userid, productid).then((response) => {
    res.redirect("/wlist");
    // res.json(response)
  });
});





//........address........//




router.post('/add_address', (req, res) => {
  let userId = req.session.user._id
  console.log(req.session.user._id, 'uuuuuuuuuuuuuddddddddd');
  address_controller.addAddress(req.body, userId).then((response) => {
    console.log(response, 'kkkkkkkkkkkkkkkk');
    res.redirect('/profile')
  })
})

router.get('/profile_address', verifylogin, (req, res) => {
  let userid = req.session.user._id
  address_controller.getAddress(userid).then((address) => {
    console.log(address, 'address......prfilelasdfjlaslfk//asf...')

    res.render('user/profile_address', { cartcount, user: true, loggedin: true, address, loggedin: req.session.loggedin, username: req.session.username })


  })
})



router.get('/remove_address/:id', (req, res) => {
  let addressid = req.params.id
  const userid = req.session.user._id
  // console.log(addressid, 'userrrrrrrrrrrrrrrrrrr');
  address_controller.removeAddresss(userid, addressid).then((response) => {
    res.redirect('/profile_address')
  })
})
router.post('/update_address/:id', (req, res) => {
  if (req.session.loggedin) {
    let addressDetails = req.body
    console.log(addressDetails, 'lllllllllllllllllllllllllllll');
    let addressid = req.params.id

    address_controller.updateAddress(addressid, addressDetails).then((response) => {
      res.redirect('/profile_address')

    })
  }

})



router.post('/add_address_checkout', verifylogin, (req, res) => {
  let userId = req.session.user._id
  // console.log(req.session.user._id, 'uuuuuuuuuuuuuddddddddd');
  address_controller.addAddress(req.body, userId).then((response) => {
    // console.log(response, 'kkkkkkkkkkkkkkkk');
    res.redirect('/checkout')
  })
})


router.post('/add_address_profile', verifylogin, (req, res) => {
  let userId = req.session.user._id
  // console.log(req.session.user._id, 'uuuuuuuuuuuuuddddddddd');
  address_controller.addAddress(req.body, userId).then((response) => {
    // console.log(response, 'kkkkkkkkkkkkkkkk');
    res.redirect('/profile_address')
  })
})








router.get('/payment/:id', verifylogin, (req, res) => {
  userid = req.session.user._id
  addressid = req.params.id
  user_controller.getuserdetails(userid).then((response) => {
    let userDetails = response.data
    //console.log(userDetails,'user details ................................');
    address_controller.getAddressData(userid, addressid).then((shipaddress) => {
      console.log(shipaddress, '----ship------------');
      // let ship = shipaddress.address
      // console.log(ship,'----ship------------');
      cart_controller.addproductdetails(userid).then((productdetails) => {
        cartdata = productdetails.cart.cartdata
        //console.log(cartdata,'cartdata........................');
        cart_controller.gettotalamount(userid).then((totalamount) => {
          //console.log(totalamount,'totalamount...................');
          cart_controller.cartcount(userid).then((cartcount) => {
            //console.log(cartcount,'...........................');
            res.render('user/payment', { cartcount, userDetails, shipaddress, cartdata, totalamount, cartcount, usre: true, loggedin: true, loggedin: req.session.loggedin, username: req.session.username, })

          })

        })

      })

    })
  })
})




router.get('/checkout', verifylogin, (req, res) => {
  if (req.session.loggedin) {
    user = req.session.user
    userid = req.session.user._id
    user_controller.getuserdetails(userid).then((response) => {
      let userDetails = response.data;
      address_controller.getAddress(userid).then((address) => {
        //console.log(address, 'addadaddaddad')
        cart_controller.addproductdetails(userid).then((productdetails) => {
          let cartdata = productdetails.cart.cartdata
          console.log(cartdata, 'cartdatatatatatatata///,..././././');
          cart_controller.gettotalamount(userid).then((totalamount) => {
            res.render('user/checkout', { user: true, cartdata, userDetails, address, totalamount, loggedin: req.session.loggedin, username: req.session.username, cartcount })
            //  console.log('checkout............');

          })
        })
      })
    })

  } else {
    res.redirect('/login')
  }
})






router.post('/payment', (req, res) => {
  console.log(req.body, "zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz")
  let userid = req.session.user._id
  let coupon = req.session.coupon
  console.log(coupon, 'sessopm coupon adataatata........a.a.a..a.a.a.a.a');
  // console.log(use,rid, '-----user id')
  console.log('---------bill body');
  user_controller.getuserdetails(userid).then((response) => {
    let userDetails = response.data;
    address = req.body.address
    console.log(address, 'addressss 444')
    address_controller.getAddressData(userid, address).then((address) => {
      // console.log(address, 'dataassa')
      cart_controller.addproductdetails(userid).then((productdetails) => {
        let DatasCart = productdetails.cart.cartdata

        order_controller.placeOrder(req.body, userid, coupon).then((orderDetails) => {
          const orderId = orderDetails._id
          console.log(orderId, '.........orderiiiiiiiiiidddddddd')
          const totalAmount = orderDetails.totalamount
          const grandtotal = orderDetails.grandtotal
          console.log('totalcart at /payment ........///', totalAmount);
          console.log('grandtotaal at /payment ........///', grandtotal);
          delete req.session.coupon;
          //console.log(req.body, '-----------55555555555555')
          if (req.body.billtype === "COD") {
            console.log('......ccccccccooooddddcccc')
            res.json({ orderDetails })


          }
          else {
            payment_controller.generateRazorpay(orderId, totalAmount).then((data) => {
              res.json({ data })
              console.log(data, 'data at razorpay')

            })
            console.log('razorpay')
          }
          //  console.log(response, 'place order response')
        })
      })
    })
  })

})


router.post('/verifyPayment', verifylogin, (req, res) => {
  //  console.log(req.body, 'verify payment......')
  payment_controller.verifyPayment(req.body).then((response) => {
    res.json({ status: true })
  })
})

router.get('/orderConfirm/:_id', verifylogin, (req, res) => {
  let orderid = req.params._id
  //console.log(req.params._id,'44444444444444444')
  order_controller.getTrack(orderid).then((orderItemsDetails) => {
    //  console.log(response.paymentMethod, '-----final response.......')
    let userid = req.session.user._id
    let addressId = orderItemsDetails.addressId
    const orderitems = orderItemsDetails.orderitems
    address_controller.getAddressData(userid, addressId).then((address) => {
      //console.log(address, 'asdasdasdasdad.......')
      res.render('user/order_confirm', { orderItemsDetails, address, orderitems, loggedin: req.session.loggedin, username: req.session.username, user: true, cartcount })



    })
  })
})

router.get('/myorders', verifylogin, (req, res) => {
  userid = req.session.user._id
  order_controller.myOrders(userid).then((orders) => {
    user_controller.getuserdetails(userid).then((response) => {
      let userdetails = response.data
      console.log(response.data, 'user drrrrr');
      console.log(orders, 'rrdro fredfff ////////');
      res.render('user/myorders', { userdetails, orders, user: true, loggedin: req.session.loggedin, username: req.session.username, cartcount })

    })

  })


})


router.post('/applycoupon', verifylogin, (req, res) => {
  userid = req.session.user._id
  console.log(req.body, 'coupon @ applycoupon');
  coupon_controller.applycoupon(req.body, userid).then((e) => {

    console.log(e, 'eeeeeeeeeeee at post user aplycoupn.......................');
    if (e.status) {
      req.session.coupon = e
      console.log(req.session.coupon, '........session.coupon');
      
      coupon_controller.couponUser(userid, req.body).then((couponuser) => {
        res.json(e)

      })

    }
    else{
      res.json(e)

    }
   
  })

})

router.get('/single_order/:_id', verifylogin, (req, res) => {
  let orderid = req.params._id
  let userid = req.session.user._id
  order_controller.getTrack(orderid).then((orderItemsDetails) => {
    console.log(orderItemsDetails, 'orderitemsdetalsss......');
    let addressId = orderItemsDetails.addressId
    const orderitems = orderItemsDetails.orderitems
    address_controller.getAddressData(userid, addressId).then((address) => {
      res.render('user/order_single', { user: true, orderItemsDetails, address, orderitems, loggedin: req.session.loggedin, username: req.session.username, cartcount })

    })


  })
})

router.post('/cancelorder/:_id', verifylogin, (req, res) => {

  orderid = req.params._id

  order_controller.cancelorder(orderid).then((cancelled) => {
    res.json({ cancelled })
  })
})

router.get('/invoice/:_id', verifylogin, (req, res) => {
  orderid = req.params._id
  order_controller.getTrack(orderid).then((orderItemsDetails) => {
    //  console.log(response.paymentMethod, '-----final response.......')
    let userid = req.session.user._id
    let addressId = orderItemsDetails.addressId
    const orderitems = orderItemsDetails.orderitems
    address_controller.getAddressData(userid, addressId).then((address) => {
      console.log(orderItemsDetails, '////////orderitem detaisl.@ unvoice.....................');
      //console.log(address, 'asdasdasdasdad.......')

      res.render('user/invoice', { user: true, orderItemsDetails, address, orderitems, loggedin: req.session.loggedin, username: req.session.username, cartcount })



    })
  })


})






// router.get('/single_order',verifylogin,(req,res)=>{
//   res.render('user/order_single')
// })

// router.get('*',(req,res)=>{
//   res.render('user/404err')
// })







module.exports = router;
