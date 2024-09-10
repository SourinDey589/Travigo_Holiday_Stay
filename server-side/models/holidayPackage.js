// models/holidayPackage.js

// import the mongoose library file
const mongoose = require('mongoose');
const ObjectID = mongoose.Schema.Types.ObjectId;

const HolidaySchema = new mongoose.Schema({
    title: {type: String, required: true, unique: true},
    // category: {type: ObjectID, required: true, ref: 'Category'},

    city: { type: String, required: true },
    address: { type: String, required: true },

    distance: { type: Number, required: true },

    photo: { type: String, required: true },
    desc: {type: String, required: true},

    price: { type: Number, required: true },

    maxGroupSize: { type: Number, required: true },

    reviews: [{ type: ObjectID, ref: "Review" }],
    
    featured: { type: Boolean, default: false },
   
},{
    timestamps: true
})

module.exports = mongoose.model( 'Holiday', HolidaySchema );