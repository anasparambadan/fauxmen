const { response } = require('../app');
const cartmodel = require('../model/cart_model');
const { findOne } = require('../model/cart_model');
const cart_model = require('../model/cart_model')


let helpers = {
    addtocart: (productid, userid) => {
        const response = {
            duplicate: false
        };
        console.log(productid, '..........productid...........', userid, '........userid..............');

        return new Promise(async (resolve, reject) => {
            try {
                let usercart = await cart_model.findOne({ userId: userid });
                console.log(usercart, 'user cart');
                if (usercart) {
                    let cartproduct = await cart_model.findOne({
                        userId: userid,
                        "cartdata.productId": productid,
                    });

                    if (cartproduct) {
                        console.log(cartproduct, 'cartproduct');
                        cart_model.updateOne({ userId: userid, "cartdata.productId": productid }, { $inc: { "cartdata.$.quantity": 1 } })
                            .then((response) => {
                                response.duplicate = true
                                resolve(response)
                            })

                    }
                    else {
                        let cartArray = { productId: productid, quantity: 1 };
                        cart_model.findOneAndUpdate({ userId: userid }, { $push: { cartdata: cartArray } })
                            .then((data) => {
                                resolve(response);
                            });
                    }
                }
                else {
                    let body = {
                        userId: userid,
                        cartdata: [{ productId: productid, quantity: 1 }],
                    };
                    await cart_model.create(body)
                }

            }
            catch (error) {
                reject(error)

            }
        })
    },




    addproductdetails: (userid) => {
        try {


            return new Promise((resolve, reject) => {
                //console.log(userid,'userid at addproductdetails');
                const response = {}
                cart_model.findOne({ userId: userid }).populate('cartdata.productId').lean().then((cart) => {
                     console.log(cart,'this is cart111');
                    if (cart) {
                        if (cart.cartdata.length > 0) {
                            console.log('cart not empty but empty.................');
                            response.cartempty = false;
                            response.cart = cart;
                            resolve(response)
                        }
                        else {
                            console.log('cart empty cart created.................');
                            response.cartempty = true;
                            response.cart = cart;
                            resolve(response)
                        }
                    }
                    else {
                        console.log('cart empty cart not created.................');
                        response.cartempty = true;

                        resolve(response)
                    }

                })

            })

        }
        catch (error) {
            reject(error)
            console.log('error');


        }

    },

    cartcount: (userid) => {
        return new Promise(async (resolve, reject) => {
            let count = 0;
            let cart = await cart_model.findOne({ userId: userid })
            if (cart) {
                console.log(cart);
                count = cart.cartdata.length
            }
            resolve(count)
        })
    },

    gettotalamount: (userid) => {
        try {
            return new Promise(async (resolve, reject) => {
                helpers.addproductdetails(userid).then((res) => {
                    let response = {}
                    cart = res.cart
                    //console.log('its cart at gettotalamount',cart);
                    let total;

                    if (cart) {
                        let cartlenght = cart.cartdata.length
                        if (cartlenght >= 0) {
                            total = cart.cartdata.reduce((acc, curr) => {
                                acc += curr.productId.discountprice * curr.quantity
                                return acc
                            }, 0)
                            //console.log('totalll',total);
                            totalmrp = cart.cartdata.reduce((acc, curr) => {
                                acc += curr.productId.price * curr.quantity
                                return acc
                            }, 0)
                            response.total = total
                            response.totalmrp = totalmrp
                            response.dicount = totalmrp-total




                            resolve(response)




                        }
                    }
                    else {
                        console.log('cart total error');
                        response.cartempty = true;
                        resolve(response)
                    }
                })
            })

        }
        catch (err) {
            reject(err)


        }
    },


    deletecart: (userid, productid) => {
        console.log('userid', userid, 'productid', productid)
        return new Promise(async (resolve, reject) => {
            try {
                await cartmodel.updateOne({ userId: userid }, { $pull: { cartdata: { productId: productid } } }).then((response) => {
                    console.log(response);
                    resolve(response)
                })

            }
            catch (err) {
                reject(err)

            }
        })

    },


    incrementqty: (userid, productid) => {
        return new Promise((resolve, reject) => {
            cartmodel.updateOne({ userId: userid, "cartdata.productId": productid }, { $inc: { "cartdata.$.quantity": 1 } }).then(async (response) => {
                let cart = await cartmodel.findOne({ userId: userid })
                let quantity
                for (let i = 0; i < cart.cartdata.length; i++) {
                    if (cart.cartdata[i].productId == productid) {
                        quantity = cart.cartdata[i].quantity
                    }
                }
                response.quantity = quantity
                resolve(response)
            })

        })
    },


    decrementqty: (userid, productid) => {
        return new Promise((resolve, reject) => {
            cartmodel.updateOne({ userId: userid, "cartdata.productId": productid }, { $inc: { "cartdata.$.quantity": -1 } }).then(async (response) => {
                let cart = await cartmodel.findOne({ userId: userid })
                let quantity
                for (let i = 0; i < cart.cartdata.length; i++) {
                    if (cart.cartdata[i].productId == productid) {
                        quantity = cart.cartdata[i].quantity
                    }
                }
                response.quantity = quantity
                resolve(response)
            })
        })
    },









}

module.exports = helpers