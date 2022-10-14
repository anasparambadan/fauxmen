const mongoose=require('mongoose');

const categorySchema=new mongoose.Schema({
    categoryname:'string'
    
},{timestamps:true})


const categoryModel=mongoose.model('categories',categorySchema);

module.exports=categoryModel;