const db=require('../config/connection');
const collection = require('../config/collections');

module.exports={


    // addProduct:(product,callback)=>{

    //     db.get().collection(collection.PRODUCT_COLLECTION).insertOne(product).then((result)=>{
    //         callback(result.insertedId);
    //     })
    // },

    getAllProducts:()=>{
        return new Promise(async (resolve,reject)=>{
            let products = await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray();
            resolve(products);
        })
    }
}