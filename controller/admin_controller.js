const adminModel = require('../model/admin_model')
const bcrypt = require('bcrypt')
const userModel = require('../model/user_model')

module.exports = {

    adminlogin: (logindata) => {

        return new Promise(async (resolve, reject) => {

            let response = {
                status: false,
                adminnotfound: false,
               
            }
            let admin = await adminModel.findOne({ email: logindata.email })
            console.log('email');
            console.log(admin,'adminninn..mmm...')

            if (admin) {
                bcrypt.compare(logindata.password, admin.password, (err, valid) => {
                    console.log('password');
                    if (valid) {
                        response.status = true
                        response.admin = admin
                        console.log(response.admin,'admin res111111111111111111')
                        response.email = admin.email
                        console.log(response.email);
                        resolve(response)
                        console.log('success');

                    } else {
                        
                        resolve(response)
                        console.log(('error while bcrypting', err));

                    }
                })
            } else {
                response.adminnotfound = true
                
                console.log('failed');
                resolve(response)
            }

        })
    },




    //...................... Block User........................//



    block_user: (id) => {
        return new Promise(async (resolve, reject) => {
            let user = await userModel.findById({ _id: Object(id) })
            user.status = true
            await userModel.updateOne({ _id: Object(id) }, user)
            resolve('got it')
        })

    },

    active_user: (id) => {
        return new Promise(async (resolve, reject) => {
            let user = await userModel.findById({ _id: Object(id) })
            user.status = false
            await userModel.updateOne({ _id: Object(id) }, user)
            resolve('its done')

        })

    }
}
