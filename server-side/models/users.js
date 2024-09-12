// models/users.js

// import the mongoose library file
const mongoose = require('mongoose');
const uniqueValidator=require('mongoose-unique-validator');

const UserSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true },
    email: {type: String, required: true, unique: true },
    password: {type: String, required: true, minLength: 4},
    photo: { type: String, default: '/avatar.jpg' },
    role: { type: String, default: "user" },
}, {
    timestamps: true
})

UserSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', UserSchema);