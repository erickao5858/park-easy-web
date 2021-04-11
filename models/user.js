const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    username: String,
    password: String
})

userSchema.plugin(passportLocalMongoose)
const User = mongoose.model('user', userSchema, 'user')

module.exports = User