// controller/HolidayPackages.js

const HolidayPackage = require('../models/holidayPackage');

// Add New Place to Travel
const AddPlace = async (req, res, next) => {
    const newTour = new HolidayPackage({
        title: req.body.title,
        city: req.body.city,
        address: req.body.address,
        distance: req.body.distance,
        photo: req.body.photo,
        price: req.body.price,
        seasonalPrice: req.body.seasonalPrice, // Optional field for sessional pricing
        seasonStart: req.body.seasonStart,    // Start date for sessional pricing
        seasonEnd: req.body.seasonEnd,        // End date for sessional pricing
        maxGroupSize: req.body.maxGroupSize,
        desc: req.body.desc,
        featured: req.body.featured || false,
    });

    try {
        if (!newTour.title || !newTour.city || !newTour.address || !newTour.distance || !newTour.desc || !newTour.price || !newTour.maxGroupSize) {
            return res.status(400).json({ error: 'Missing required fields.' });
        }

        // Check if a photo was uploaded
        if (req.file) {
            newTour.photo = `/uploads/${req.file.filename}`;
        } else if (req.existingFilePath) {
            // If the file exists, use the existing file path
            newTour.photo = req.existingFilePath.replace('uploads', '/uploads');
        }

        const savedHoliday = await newTour.save();
        return res.status(201).json({ message: 'Holiday Package Successfully Created.', holidayPackage: savedHoliday });
    } catch (error) {
        console.error('Error Details:', error);
        return res.status(500).json({ error: 'Failed to create Holiday Package.', details: error.message });
    }
};

// View All Travel Places
const ViewPlace = async (req, res, next) => {
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
        if (!tour) {
            return res.status(404).json({ message: 'Holiday Package Not Found!' });
        }

        const currentDate = new Date();
        let currentPrice = tour.price;

        // Check if sessional pricing applies
        if (tour.seasonStart && tour.seasonEnd) {
            const seasonStart = new Date(tour.seasonStart);
            const seasonEnd = new Date(tour.seasonEnd);

            if (currentDate >= seasonStart && currentDate <= seasonEnd && tour.seasonalPrice) {
                currentPrice = tour.seasonalPrice;
            }
        }

        return res.json({
            holidayPackage: {
                ...tour.toObject(),
                currentPrice, // Include calculated price based on session
            },
        });
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
        return res.json({ message: 'Holiday Package Deleted' });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

// View Travel Places by Search
const ViewPlaceBySearch = async (req, res, next) => {
    const { city, distance, maxGroupSize } = req.query;
    const query = {};

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

// Get Tour Counts
const getTourCount = async (req, res, next) => {
    try {
        const tourCount = await HolidayPackage.estimatedDocumentCount();
        return res.json(tourCount);
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch", error: error.message });
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