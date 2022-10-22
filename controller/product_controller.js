const productmodel = require("../model/product_model")
const multer = require('multer')
const upload = multer({ dest: "public/productimage" });
const { router } = require("../app")







module.exports = {

    addproduct: (productData) => {
        console.log(productData);
        console.log("sghghgdf");
        return new Promise((resolve, reject) => {
            products = new productmodel({
                productname: productData.productname,
                brand: productData.brand,
                price: productData.price,
                discountprice: productData.discountprice,
                categoryname: productData.categoryname,
                stock: productData.stock,
                description: productData.description,
                image: productData.image,
                percentage: 100 - parseInt((parseInt(productData.discountprice) / parseInt(productData.price)) * 100)
            })
            console.log("jjjjjjjjjjjjjjjjjjjjjjjjjjjjjj");
            console.log(productData.categoryname);
            products.save().then((data) => {
                console.log("lalaaa");
                resolve(data)
            })
        })

    },
    deleatproducts(productID) {
        return new Promise(async (resolve, reject) => {
            productmodel.findByIdAndDelete({ _id: productID }).then((response) => {

                resolve(response)

            })
        })

    },


    getPoductdetails: () => {
        return new Promise(async (resolve, reject) => {
            let response = {}
            let product = await productmodel.find().populate('categoryname').lean()
            console.log('product========', product);
            response.status;
            response.data = product;
            resolve(response)
        })
    },

    getPoductdetailslim: () => {
        return new Promise(async (resolve, reject) => {
            let response = {}
            let product = await productmodel.find().sort({ createdAt: -1 }).limit(8).populate('categoryname').lean()
            console.log('product========', product);
            response.status;
            response.data = product;
            resolve(response)
        })
    },

    getCatProducts: (catid) => {
        return new Promise(async (resolve, reject) => {
            let response = {}
            let product = await productmodel.find({ categoryname: catid }).lean()
            console.log('product========', product);
            response.status;
            response.data = product;
            resolve(response)
        })
    },


    getPoductvalue: (productID) => {


        
        return new Promise(async (resolve, reject) => {
            console.log('error aaa..............');
            try{
                console.log('error aaa..............3333333');
                let response = {}
                let product = await productmodel.findOne({ _id: productID }).lean()
                response.status;
                response.data = product;
                resolve(response)

            }
            catch(error) {
                console.log('error aaa..............4444444');
               
                reject(error)

            }

        })
    },

    updateProduct: (productID, productDetails) => {
        return new Promise(async (resolve, reject) => {

            console.log("huuuuuuuuuuuuuuuuuuuuu");
            console.log(productID);
            console.log(productDetails);
            productmodel.findByIdAndUpdate(productID, {
                productname: productDetails.productname,
                price: productDetails.price,
                discountprice: productDetails.discountprice,
                categoryname: productDetails.categoryname,
                stock: productDetails.stock,
                image: productDetails.image
                // image:<img 
            }).then((response) => {
                resolve(response)
            })
        })

    },

    productlist: () => {
        return new promise(async (resolve, reject) => {
            let response = {}
            let listproduct = await productmodel.find({}).lean()
            response.status;
            response = listproduct,
                resolve(response)
        })
    }






}