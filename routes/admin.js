const express = require('express');

var router = express.Router();
const User = require('../model/user_model')
const admin_controller = require('../controller/admin_controller');
const category_controller = require('../controller/category_controllerl')
const session = require('express-session')
const category = require('../model/category_model')
const admin = require('../model/admin_model')
const product_controller = require('../controller/product_controller');
const banner_controller = require('../controller/banner_controller')
const coupon_controller = require('../controller/coupon_controller')


const { trusted } = require('mongoose');
const { response } = require('../app')


//...........MulteR.............//
const multer = require('multer');
const order_controller = require('../controller/order_controller');
const user_controller = require('../controller/user_controller');
const filestorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/productimages')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '--' + file.originalname)
  }
})
const upload = multer({ storage: filestorageEngine })

//...........MulteR.............//

const bannerimage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/bannerimages')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '--' + file.originalname)
  }
})
const upload1 = multer({ storage: bannerimage })



/* GET users listing. */

router.get('/', function (req, res, next) {
  if (req.session.admin) {
    res.redirect('/adminlogin')
  }
  else {
    res.render('admin/login_admin', { admin: true, loginerr: req.session.logginerror });

  }

});

let verifylogin = (req, res, next) => {
  if (req.session.admin) {
    next();
  }
  else {
    res.redirect('/admin')
  }
}



// .................admin login post..................

router.post('/adminlogin', (req, res, next) => {


  admin_controller.adminlogin(req.body).then((response) => {

    if (response.status) {
      console.log(response.admin.name, 'admin res11111111111111111122222222')
      req.session.admin = response.admin
      order_controller.salestoday().then((ordertoday) => {
        order_controller.ordersAll().then((allorders) => {
          user_controller.allusers().then((userinfo) => {
            order_controller.ordersAll().then((orderscount) => {
              let todaysales = ordertoday.todaysale
              let name = response.admin.name
              res.render('admin/admin_dashboard', { layout: 'layout_admin', admin: true, todaysales, allorders, name, userinfo, orderscount })

            })

          })

        })



      })


    }
    else if (response.adminnotfound) {


      req.session.logginerror = 'Invalied User name/Password'
      console.log('admin not found');
      res.redirect('/admin')
    }
    else {
      req.session.logginerror = 'Invalied User name/Password'
      console.log('admin login faild');
      res.redirect('/admin')
    }
  })


});

router.get('/dashboard', verifylogin, (req, res) => {
  order_controller.salestoday().then((ordertoday) => {
    order_controller.ordersAll().then((allorders) => {
      user_controller.allusers().then((userinfo) => {
        order_controller.ordersAll().then((orderscount) => {
          let todaysales = ordertoday.todaysale

          res.render('admin/admin_dashboard', { layout: 'layout_admin', admin: true, todaysales, allorders, userinfo, orderscount })

        })

      })

    })



  })

})

router.get('/edit_user', (req, res, next) => {

  if (req.session.admin) {
    User.find().lean().exec((error, data) => {
      res.render('admin/edit_user', { layout: 'layout_admin', admin: true, user: data });

    })

  }
  else {
    res.redirect('/admin')
  }

});

// .........admin logout...............///

router.get('/logout', function (req, res, next) {
  req.session.destroy()
  res.redirect('/admin');
});

//..................block.........................////
router.get('/block-user/:id', (req, res) => {
  if (req.session.admin) {
    let id = req.params.id
    console.log("working");
    admin_controller.block_user(id).then((response) => {
      console.log(response);
      res.redirect('/admin/edit_user')
    })

  }
  else {
    res.redirect('/admin')
  }


})
//...................active user....................//////

router.get('/active-user/:id', (req, res) => {

  if (req.session.admin) {
    let id = req.params.id
    console.log("active-working");
    admin_controller.active_user(id).then((response) => {
      console.log(response);
      res.redirect('/admin/edit_user')
    })
  }
  else {
    res.redirect('/admin')
  }

})



// .....................category router..................//




router.get('/view_category', (req, res) => {
  if (req.session.admin) {
    category_controller.getcategory().then((response) => {
      console.log('************', response, "this is response");
      res.render('admin/category_manage', { response, layout: 'layout_admin', admin: true })
    })
  } else {
    res.redirect('/admin')
  }
})


////////////get category data////////////////////////

router.get('/addcatergory', (req, res) => {

  if (req.session.admin) {
    const categoryexist = req.session.categoryexist;
    req.session.categoryexist = null;

    res.render('admin/add_category', { layout: 'layout_admin', admin: true, categoryexist })

  }
  else {
    res.redirect('/admin')
  }

})


router.post('/addcategory', (req, res) => {
  if (req.session.admin) {
    category_controller.addcategoryDate(req.body).then((response) => {
      console.log(response);
      console.log(req.body);
      if (response.exist) {
        req.session.categoryexist = true
        req.session.category = res.category;
        res.redirect('/admin/addcategory')
      } else {
        req.session.category = response.category
        console.log(req.session.category);
        console.log(response);
        res.redirect('/admin/view_category');
      }
    }).catch((err) => {
      console.log("error found", err);
    })
    res.render('admin/edit_user')

  }
  else {
    res.redirect('/admin')
  }


})

//.............................delete category..............................//

router.get('/delete-category/:_id', (req, res) => {
  if (req.session.admin) {
    const categoryid = req.params._id;

    category_controller.deletecategory(categoryid).then((data) => {
      res.redirect('/admin/view_category')
    })

  }
  else {
    res.redirect('/admin')
  }

})

//update category/////////////////

router.get('/updatecategory/:id', (req, res) => {
  if (req.session.admin) {
    console.log(req.params);
    const categoryid = req.params.id;
    category_controller.getcategorydata(categoryid).then((categorydata) => {
      console.log(categorydata);
      res.render('admin/update_category', { categorydata })
    })

  }
  else {
    res.redirect('/admin')
  }

})


router.post('/updatecategory/:id', (req, res) => {
  if (req.session.admin) {
    const categoryid = req.params.id;

    category_controller.updatecategory(categoryid, req.body).then((response) => {
      console.log(response);
      res.redirect('/admin/view_category')

    })

  }
  else {
    res.redirect('/admin')
  }


});



//...............product-mangement..............//



router.get('/view_product', (req, res) => {


  if (req.session.admin) {
    console.log("raaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    product_controller.getPoductdetails().then((productdetails) => {
      console.log("vaaaaaaaaaaaaaaaaaaaaaaa");
      console.log(productdetails);

      res.render('admin/product_manage', { productdetails, layout: "layout_admin", admin: true })
    })
  } else {
    res.redirect('/admin')
  }
})




//...............delete product................//
router.get('/delete-product/:_id', (req, res) => {
  if (req.session.admin) {
    let productID = req.params._id
    product_controller.deleatproducts(productID).then((response) => {
      res.redirect('/admin/view_product')

    })

  }
  else {
    res.redirect('/admin')
  }

})

//..............edit product...........//
router.get('/update-product/:_id', (req, res) => {
  if (req.session.admin) {
    let productID = req.params._id
    product_controller.getPoductvalue(productID).then((productdata) => {
      category_controller.getcategory(productID).then((category) => {

        console.log("areeewaaaaaaaaaaaaaaaaaaa");
        console.log(productdata);

        res.render('admin/update_product', { productdata, category, layout: "layout_admin", admin: true })
      })
    })

  }
  else {
    res.redirect('/admin')
  }

})


router.post('/updateproduct/:_id', upload.array("image", 4), (req, res) => {
  if (req.session.admin) {
    const images = req.files
    let array = [];
    array = images.map((value) => value.filename)
    req.body.image = array
    let productid = req.params._id

    console.log(productid);

    product_controller.updateProduct(productid, req.body).then((productdata) => {

      console.log(productdata);

      res.redirect('/admin/view_product')

    })
  }
  else {
    res.redirect('/admin')
  }

})

//........image adding....................//

router.post('/addproducts', upload.array("image", 4), (req, res) => {
  if (req.session.admin) {

    const images = req.files
    array = images.map((value) => value.filename)
    req.body.image = array
    product_controller.addproduct(req.body).then((response) => {
      res.redirect('/admin/view_product');
    }).catch((err) => {
      console.log("error found", err);
    })
  }
  else {
    res.redirect('/admin')
  }

});



//.......get......Add Product.................//

router.get('/add_product', (req, res) => {
  if (req.session.admin) {
    req.session.productexist = null
    category_controller.getcategory().then((category) => {

      res.render('admin/add_product', { category, layout: "layout_admin", admin: true })
    })

  }
  else {
    res.redirect('/admin')
  }

})

//...........Post....Add Product...................//
router.post('/addproducts', upload.array("image", 3), (req, res) => {
  if (req.session.admin) {
    console.log(req.body.categoryname, 'fghfghjghjgjh');
    const images = req.files
    let array = [];
    array = images.map((value) => value.filename)
    req.body.image = array
    product_controller.addproduct(req.body).then((response) => {
      console.log(req.body);

      if (response.exist) {
        req.session.productexist = true
        req.session.product = response.product

        res.redirect('/admin/add_product')
      } else {
        req.session.product = response.product

        res.redirect('/admin/view_product')
      }
    }).catch((err) => {
      console.log('error found', err);
    })

  }
  else {
    res.redirect('/admin')
  }

})



//..................banner management.....................//

router.get('/banner', verifylogin, (req, res) => {

  banner_controller.getbannerdata().then((bannerDetails) => {
    //console.log(bannerDetails, '.....................bannerDetails')
    res.render('admin/banner', { admin: true, bannerDetails, layout: 'layout_admin' })
  })


})


router.post('/addbanner', upload1.array('image', 1), (req, res) => {
  //console.log(req.body,'req.boddddddddyyyyyyyy');
  const images = req.files


  console.log(images, 'post banner success')

  array = images.map((value) => value.filename)
  //console.log(array,'------arrrrraaaaaaayyyyyyy');
  req.body.image = array
  banner_controller.addbanner(req.body).then((response) => {
    // console.log(response,'----------------banner aded')
    res.redirect('/admin/banner')
  })
})

router.post('/editbanner/:id', verifylogin, upload1.array('image', 1), (req, res) => {
  const images = req.files
  let array = images.map((value) => value.filename)
  req.body.image = array
  let bannerid = req.params.id
  banner_controller.updatebanner(bannerid, req.body).then((response) => {
    res.redirect('/admin/banner')
  })
})

router.get('/deletebanner/:_id', verifylogin, (req, res) => {
  let bannerid = req.params._id
  banner_controller.deletebanner(bannerid).then((response) => {
    res.redirect('/admin/banner')
  })
})


//........{{{{{{{......  coupon  .....}}}}}}};.......//

router.get('/coupon', verifylogin, (req, res) => {
  coupon_controller.allcoupons().then((allcoupons) => {
    res.render('admin/coupon_manage', { admin: true, allcoupons, layout: "layout_admin" })

  })

})



router.post('/add_coupon', verifylogin, (req, res) => {
  console.log(req.body, '..............................cooupon body')
  coupon_controller.addcoupon(req.body).then((response) => {
    console.log(response, 'new couponn,.,.,..,..,.,.,.,.,.');

    res.redirect('/admin/coupon')
  })

})

router.get('/deletcoupon/:_id', verifylogin, (req, res) => {
  let cpnid = req.params._id
  coupon_controller.coupondelete(cpnid).then((response) => {
    res.redirect('/admin/coupon')

  })
})


// ...........orders.......... //

router.get('/orders', verifylogin, (req, res) => {
  order_controller.allOrders().then((orders) => {

    console.log(orders, '-------------admin orders')
    res.render('admin/orders', { layout: "layout_admin", admin: true, orders })
  })

})


router.post('/shiporder/:_id', verifylogin, (req, res) => {

  orderid = req.params._id
  console.log(orderid, 'shiporder id.................l..l.l.l');

  order_controller.shiporder(orderid).then((shipped) => {
    res.json({ shipped })
  })
})
router.post('/delivered/:_id', verifylogin, (req, res) => {

  orderid = req.params._id
  console.log(orderid, 'deliveredd id.................l..l.l.l');

  order_controller.delivered(orderid).then((shipped) => {
    res.json({ shipped })
  })
})

router.get('/getdash', verifylogin, (req, res) => {
  order_controller.stati().then((status) => {
    res.json({ status })

  }).catch((err) => {
    next(err)
  })

})





module.exports = router;
