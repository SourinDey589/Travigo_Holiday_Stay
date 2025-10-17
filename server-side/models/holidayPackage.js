// models/holidayPackage.js

// import the mongoose library file
const mongoose = require('mongoose');
const ObjectID = mongoose.Schema.Types.ObjectId;

const HolidaySchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    distance: { type: Number, required: true },
    photo: { type: String },
    desc: { type: String, required: true },
    price: { type: Number, required: true },
    seasonalPrice: { type: Number }, // New field for seasonal price
    seasonStart: { type: Date },    // Start date of the seasonal pricing
    seasonEnd: { type: Date },      // End date of the seasonal pricing
    maxGroupSize: { type: Number, required: true },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    featured: { type: Boolean, default: false },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Holiday', HolidaySchema);