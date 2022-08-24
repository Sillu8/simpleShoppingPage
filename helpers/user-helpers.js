const db = require('../config/connection');
const collection = require('../config/collections');
const bcrypt = require('bcrypt');
const objectId = require('mongodb').ObjectId


module.exports = {
    doSignup: (userData) => {
        return new Promise(async (resolve, reject) => {

            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ userEmail: userData.userEmail });
            if (user) {
                resolve({userExists: true})
            } else {
                userData.userPassword = await bcrypt.hash(userData.userPassword, 10);
                db.get().collection(collection.USER_COLLECTION).insertOne(userData).then(() => {
                    resolve();
                })
            }
        });
    },

    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let response = {};
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ userEmail: userData.userEmail });
            if (user) {
                bcrypt.compare(userData.userPassword, user.userPassword).then((status) => {
                    if (status) {
                        response.user = user;
                        response.status = true;
                        resolve(response);
                    }
                    else {
                        resolve({ status: false, errMessage: "Invalid username or password" })
                    }
                })
            } else {
                resolve({ status: false, errMessage: "User doesn't exist" });
            }
        })
    },

    getAllUsers: () => {
        return new Promise(async (resolve, reject) => {
            let user = await db.get().collection(collection.USER_COLLECTION).find().toArray();
            resolve(user);
        })
    },

    getUserDetails: (userId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).findOne({ _id: objectId(userId) }).then((response) => {
                resolve(response);
            }).catch((err) => {
                reject(err)
            })
        })
    },

    editUser: (user) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).updateOne({ _id: objectId(user._id) }, { $set: { userName: user.userName, userEmail: user.userEmail } }).then((response) => {
                resolve(response);
            })
        })
    },

    deleteUser: (userId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).deleteOne({ _id: objectId(userId) }).then((response) => {
                resolve(response);
            })
        });
    }

}