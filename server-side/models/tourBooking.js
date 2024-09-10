// models/tourBooking.js

// import the mongoose library file
const mongoose = require('mongoose');
const ObjectID = mongoose.Schema.Types.ObjectId;

const BookingSchema = new mongoose.Schema({

    userId: { type: String },
    userEmail: { type: String },
    tourName: { type: String, required: true },
    fullName: { type: String, required: true },
    room: { type: Number, required: true },
    adult: { type: Number, required: true },
    child: { type: Number, required: true },
    phone: { type: Number, required: true },
    bookAt: { type: Date, required: true },
    totalAmount: { type: Number, required: true },
    status: { 
        type: String, 
        enum: ['Pending', 'Confirmed', 'Cancelled'], 
        default: 'Pending' 
    },

}, {
    timestamps: true
})

module.exports = mongoose.model('Booking', BookingSchema);