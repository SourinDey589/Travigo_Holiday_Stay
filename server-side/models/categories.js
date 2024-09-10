// models/categories.js

// import the mongoose library file
const mongoose = require('mongoose');
const ObjectID = mongoose.Schema.Types.ObjectId;

const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    holiday: [{type: ObjectID, required: true, ref: 'Holiday'}]
}, {
    timestamps: true
})

module.exports = mongoose.model( 'Category', CategorySchema );