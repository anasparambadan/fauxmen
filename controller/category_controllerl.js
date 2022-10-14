const { response } = require("../app");
const categoryModel = require("../model/category_model");

module.exports={

    addcategoryDate:(categorydata)=>{
        return new Promise(async (resolve,reject)=>{
            const category = await categoryModel.findOne({categoryname: categorydata.categoryname}).lean()
            
            const response = {
                exist:false,
            }
            if(!category){
                categoryModel.create(categorydata).then((data)=>{
                     response.exist = false;
                     response.category =categorydata;
                     resolve(response);
                }).catch((err)=>{
                    console.log("error at creating",err);
                    resolve(err);
                })
            }else{
                response.exist =true;
                response.category= categorydata;
                resolve(response)
            }
        })
    },

    getcategory: () =>{
    return new Promise(async(resolve,reject)=>{
        const categoryname = await categoryModel.find({}).lean()
       
        console.log(categoryname,'----categoryname----');
        resolve(categoryname)

    })
},

   
deletecategory: (categoryid) =>{
    return new Promise(async(resolve,reject)=>{
        categoryModel.findByIdAndDelete({_id:categoryid}).then((response)=>{
            resolve(response)
        })
    })
},

getcategorydata: (categoryid)=>{
    return new Promise(async(resolve,reject)=>{
        const category=await categoryModel.findOne({_id:categoryid}).lean()

      resolve(category)
    })
},

updatecategory:(categoryid,categoryDetails)=>{
    
    return new Promise((resolve,reject)=>{
        
        categoryModel.findByIdAndUpdate(categoryid,{categoryname:categoryDetails.categoryname}).then((response)=>{
            console.log(response);
        resolve(response)
    })
})
},




}