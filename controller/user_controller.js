const userModel = require('../model/user_model')
const bcrypt = require('bcrypt')
const { promise } = require('bcrypt/promises')

module.exports = {

    userlogin: (logindata) => {
        

        return new Promise(async (resolve, reject) => {

            let response = {
                status: false,
                usernotfound: false
            }
            let user = await userModel.findOne({ email: logindata.email })
            console.log('user email found',user);

            

            
            if (user) {
                bcrypt.compare(logindata.password, user.password, (err,valid)=>{
                    console.log('password');
                    if(valid){
                        response.status = true
                        response.user = user
                        response.email = user.email
                        console.log(response.email);
                        resolve(response)
                        console.log('success');

                    }else{
                        resolve(response)
                        console.log(('error while bcrypting',err));
                    }
                })
            } else {
                response.usernotfound = true
                console.log('failed');
                resolve(response)
            }

        })
    },


    usersignup:(userdata)=>{
        return new Promise(async (resolve,reject)=>{
            let user=await userModel.findOne({email:userdata.email});
            const state={
                userexist:false,
                user:null
            }
            if(!user){
                // userdata.password= await bcrypt.hash(userdata.password,10);
                console.log(userdata.password);
                userModel.create(userdata).then((data)=>{
                    console.log(data);
                    state.userexist=false;
                    state.user=userdata;
                    state.email=userdata.email;
                    state.name = userdata.name
                    //state.phone=userdata.phonenumber;
                    resolve(state);
                })
            }else{
                state.userexist=true;
                resolve(state);
            }
        })
    },

    updateuserverify: (phone)=>{
        return new Promise (async(resolve,reject)=>{
            let response={status:true}
       await userModel.findOneAndUpdate({phonenumber:phone},{verified:true}).then(()=>{
        response.status=true; 
        resolve(response)
       })
      
        })
       },

            getuserdetails:(userID)=>{
            return new Promise(async(resolve,reject)=>{
                let response = {}
                let user = await userModel.findOne({_id:userID}).lean()
                console.log(user,"..................userrrr.............")
                response.status;
                response.data = user
                resolve(response)
            })
        },

        updateuser:(userID,userDetails)=>{
            return new Promise(async(resolve,reject)=>{
                try{
                    await userModel.findByIdAndUpdate({_id:userID},{
                        name:userDetails.name,
                        email:userDetails.email,
                        phonenumber:userDetails.phonenumber
                    }).then((response)=>{
                        resolve(response)
                    })

                }

                catch(error){
                    console.log('errorr')
                    reject(error)

                }
            })
        },

        allusers:()=>{
            return new Promise((resolve,reject)=>{
                try{
                    let response = {}
                     userModel.find().lean().then((users)=>{
                        let totaluser = users.length;
                        userModel.find({status:true}).lean().then((blocked)=>{
                            blockeduser = blocked.length
                            userModel.find({status:false}).lean().then((active)=>{
                                activeuser = active.length
                                response.totalusers = totaluser;
                                response.activeusers = activeuser
                                response.blockedusers = blockeduser
                                resolve(response)
                            })
                        })
                    })

                }
                catch(error){
                    reject(error)

                    
                }
            })
        }


        // addaddress:(userId,addressdetails)=>{

           
        //     return new Promise (async(resolve,reject)=>{
        //      let address =  await userModel.findByIdAndUpdate({_id:userId},{
        //             "address.name":addressdetails.name,
        //             "address.email":addressdetails.email,
        //             "address.housename":addressdetails.housename,
        //             "address.area":addressdetails.area,
        //             "address.district":addressdetails.district,
        //             "address.state":addressdetails.state    ,
        //             "address.pin":addressdetails.pin,
        //             "address.phone":addressdetails.phone,
        //         })
        //         resolve(address)
        //     })
        // }

    

}