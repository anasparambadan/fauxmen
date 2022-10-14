
const mongoose=require('mongoose');
const bcrypt=require("bcrypt");

const userSchema=new mongoose.Schema({
    name:String,
    email:String,
    phonenumber:String,
    password:String,
    status:Boolean,
    
});

userSchema.pre('save',async function(next){
    try{
        let hash = await bcrypt.hash(this.password,10);
        this.password=hash;
      
        next();
    }catch(error){
        console.log('error');
        next(error);
    }
})
const userModel=mongoose.model('user',userSchema);

module.exports=userModel;