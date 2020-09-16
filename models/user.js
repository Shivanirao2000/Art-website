const mongoose = require('mongoose');
const passportLocalMongoose=require("passport-local-mongoose");
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
    email: String,
    secretToken: String,
    active: Boolean,
    username: String,
    password: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
});

const User = mongoose.model('user', userSchema);
userSchema.plugin(passportLocalMongoose);
module.exports = User;
