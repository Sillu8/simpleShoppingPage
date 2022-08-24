const db = require('../config/connection');
const collection = require("../config/collections")

module.exports = {
    doAdminLogin: (adminData) => {
        return new Promise(async (resolve,reject)=>{
            let admin = await db.get().collection(collection.ADMIN_COLLECTION).findOne({ email: adminData.Email });
            if (admin) {
                if(admin.password === adminData.Password){
                    resolve({status:true});
                }else{
                    resolve({ status: false});
                }   
            }
            else {
                resolve({ status: false })
            }
        })
        
    }
}