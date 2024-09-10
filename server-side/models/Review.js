// models/Review.js

// import the mongoose library file
const mongoose = require('mongoose');
const ObjectID = mongoose.Schema.Types.ObjectId;

const reviewSchema = new mongoose.Schema({
    holiday: {type: ObjectID, ref: "Holiday" },
    username: { type: String, required: true },
    userImg: { type: String , default: '/profile-images/avatar.jpg'},

    reviewText: { type: String, required: true },
    rating: { type: Number, required: true, min: 0, max: 5, default: 0 },
}, { 
    timestamps: true 
});

module.exports = mongoose.model( 'Review', reviewSchema );