// controller/HolidayPackages.js

// import the places file from models
const HolidayPackage = require('../models/holidayPackage');
// const Category = require('../models/categories');

// Add New Place to Travel
const AddPlace = async (req, res, next) => {
    // Create a new HolidayPackage instance with the request body
    const newTour = new HolidayPackage({
        title: req.body.title,
        city: req.body.city,
        address: req.body.address,
        distance: req.body.distance,
        price: req.body.price,
        maxGroupSize: req.body.maxGroupSize,
        desc: req.body.desc,
        photo: req.body.photo,
        featured: req.body.featured || false,
    });

    try {
        // Validate request body fields
        if (!newTour.title || !newTour.city || !newTour.address || !newTour.distance || !newTour.photo || !newTour.desc || !newTour.price || !newTour.maxGroupSize) {
            return res.status(400).json({ error: 'Missing required fields.' });
        }

        if (req.photo) {
            updatedData.photo = `/uploads/${req.file.filename}`;
        } else if (req.existingFilePath) {
            // If the file exists, use the existing file path
            updatedData.photo = req.existingFilePath.replace('uploads', '/uploads');
        }

        // Save the new holiday package to the database
        const savedHoliday = await newTour.save();

        // Respond with a success message and the saved holiday package
        return res.status(201).json({ message: 'Holiday Package Successfully Created.', holidayPackage: savedHoliday });
    } catch (error) {
        // Log the error details for debugging
        console.error('Error Details:', error);

        // Respond with a generic error message
        return res.status(500).json({ error: 'Failed to create Holiday Package.', details: error.message });
    }
};

// View All Travel Places
const ViewPlace = async (req, res, next) => {

    // for pagination
    const page = parseInt(req.query.page);

    try {
        const tour = await HolidayPackage.find().populate("reviews").skip(page * 8).limit(8);
        return res.json({ count: tour.length, tour });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}; 

// View Travel Places by ID
const ViewPlaceById = async (req, res, next) => {
    const id = req.params.id;

    try {
        const tour = await HolidayPackage.findById(id).populate("reviews");
        {/*if (post.owner.toString() !== req.User.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }*/}
        if(!tour){
            return res.json({ message: 'Holiday Package Not found!' });
        }

        return res.json(tour);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

// Update Travel Places
const UpdatePlace = async (req, res, next) => {
    const id = req.params.id;

    try {
        const updateTour = await HolidayPackage.findByIdAndUpdate(id, {
            $set: req.body
        }, { new: true });
        {/*if (post.owner.toString() !== req.User.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }*/}
        
        return res.json({ message: 'Holiday Package Updated', updateTour });
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong, could not update your Holiday Package.', error: error.message });
    }

};

// Delete Travel Places
const DeletePlace = async (req, res, next) => {
    const id = req.params.id;

    try {
        await HolidayPackage.findByIdAndDelete(id);
        {/*if (post.owner.toString() !== req.User.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }*/}
        return res.json({ message: 'Holiday Package Deleted'});
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

// get tour by search
const ViewPlaceBySearch = async (req, res, next) => {
    const { city, distance, maxGroupSize } = req.query;
    const query = {}; // Initialize an empty query object

    
    if (city) {
        query.city = new RegExp(city, 'i'); 
    }

    if (distance) {
        const distanceValue = parseInt(distance);
        if (!isNaN(distanceValue)) {
            query.distance = { $gte: distanceValue }; 
        }
    }

    if (maxGroupSize) {
        const maxGroupSizeValue = parseInt(maxGroupSize);
        if (!isNaN(maxGroupSizeValue)) {
            query.maxGroupSize = { $gte: maxGroupSizeValue };
        }
    }

    try {
        const tour = await HolidayPackage.find(query).populate("reviews");
        return res.json({ tour });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


// View All Featured Places
const ViewFeaturedPlace = async (req, res, next) => {

    try {
        const tour = await HolidayPackage.find({ featured: true }).populate("reviews").limit(8);
        return res.json(tour);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}; 

// get tour counts
const getTourCount = async (req, res, next) => {

    try {
        const tourCount = await HolidayPackage.estimatedDocumentCount();
        return res.json( tourCount );
    } catch (error) {
        return res.status(500).json({ message: "failed to fetch", error: error.message });
    }
}; 

// View All Travel Places
const ViewAllPlace = async (req, res, next) => {

    try {
        const tour = await HolidayPackage.find({});
        return res.json({ tour });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

module.exports = { AddPlace, ViewPlace, ViewPlaceById, ViewPlaceBySearch, ViewFeaturedPlace, getTourCount, UpdatePlace, DeletePlace, ViewAllPlace };