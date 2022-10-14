const mongoose=require('mongoose');
const bcrypt=require("bcrypt");

const adminSchema=new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    
});

adminSchema.pre('save',async function(next){
    try{
        let hash = await bcrypt.hash(this.password,10);
        this.password=hash;
      
        next();
    }catch(error){
        console.log('error');
        next(error);
    }
})
const adminModel=mongoose.model('admin',adminSchema);

module.exports=adminModel;