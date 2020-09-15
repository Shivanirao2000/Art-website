// var mongoose=require("mongoose");
// var passportLocalMongoose=require("passport-local-mongoose");

// var UserSchema=new mongoose.Schema({
// 	username: String,
// 	password: String
// });

// UserSchema.plugin(passportLocalMongoose);
// module.exports=mongoose.model("User",UserSchema);

const mongoose = require('mongoose');
const passportLocalMongoose=require("passport-local-mongoose");
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
    email: String,
    secretToken: String,
    active: Boolean,
    username: String,
    password: String
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
});

const User = mongoose.model('user', userSchema);
userSchema.plugin(passportLocalMongoose);
module.exports = User;
// module.exports.hashPassword = async (password) => {
//     try {
//         const salt = await bcrypt.genSalt(10);
//         return await bcrypt.hash(password, salt);
//     } catch(error) {
//         throw new Error('Hashing failed', error);
//     }
// };
// module.exports.comparePasswords = async (inputPassword, hashedPassword) => {
//     try {
//         return await bcrypt.compare(inputPassword, hashedPassword);
//         // return inputpassword !== hashedpassword
//     } catch(error) {
//         throw new Error('Comparing failed', error);
//     }
// };

// userSchema.methods.authenticate = function(password) {
//     //implementation code goes here
//     passport.authenticate('local', function (err, user, info) {
//         if (err || !user) {
//             res.send(info);
//         } else {
//             res.json({
//                 status: 'true',
//                 message: 'Logged In'
//             });
//         }
//       })(req, res, next);
//   }

