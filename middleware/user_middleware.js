const userModel = require ('../model/user_model');
const usercontroller = require('../controller/user_controller')
const cart_controller = require('../controller/cart_controller')

module.exports = {
    isblocked: (req,res,next) =>{
        if(req.session.user){
            new Promise(async(resolve,reject)=>{
                console.log(req.session.email,'middlewqqqqqqerwe');
                let user= await userModel.findOne({email:req.session.email})
              //console.log(user);
                resolve(user)
            }).then((user)=>{
                
                if(user){
                    if(user.status){
                        
                        req.session.blockeduser = user.status
                        
                        res.redirect('/login')
                        // res.redirect('user/user_login')
                    //     res.send("user is blocked <button><a href='/user_login'>click</a></button>")
                    //     res.sendStatus(404)
                     }
                    else{
                        next()
    
                    }
                }else{
                    next()
                }
            })
        }else{
            next()

        }


    },
    
}