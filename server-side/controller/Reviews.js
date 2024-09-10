// controller/Reviews.js

// Import required models
const Review = require('../models/Review');
const HolidayPackage = require('../models/holidayPackage');

// Create a new review
const createReview = async (req, res, next) => {
    const tourId = req.params.id;
    const newReview = new Review({ ...req.body, holiday: tourId });

    try {
        // Save the new review
        const savedReview = await newReview.save();

        // Update the holiday package with the new review ID
        await HolidayPackage.findByIdAndUpdate(tourId, {
            $push: { reviews: savedReview._id },
        });

        // Recalculate the average rating for the package
        const reviews = await Review.find({ holiday: tourId });
        const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

        // Update the package with the new average rating
        await HolidayPackage.findByIdAndUpdate(tourId, {
            averageRating: averageRating.toFixed(2)
        });

        return res.status(201).json({ message: 'Review Submitted.', review: savedReview, averageRating });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Get all reviews for a specific package
const getReviewsForPackage = async (req, res, next) => {
    const tourId = req.params.id;

    try {
        const reviews = await Review.find({ holiday: tourId });

        if (!reviews.length) {
            return res.status(404).json({ message: 'No reviews found for this package.' });
        }

        return res.status(200).json({ reviews });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Get average rating for a specific package
const getAverageRatingForPackage = async (req, res, next) => {
    const tourId = req.params.id;

    try {
        const reviews = await Review.find({ holiday: tourId });

        if (!reviews.length) {
            return res.status(404).json({ message: 'No reviews found for this package.' });
        }

        const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

        return res.status(200).json({ averageRating: averageRating.toFixed(2) });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Get the total number of reviews for all packages
const getTotalReviewsCount = async (req, res, next) => {
    try {
        const totalReviews = await Review.countDocuments({});
        return res.status(200).json({ totalReviews });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Get top-rated packages
const getTopRatedPackages = async (req, res, next) => {
    try {
        const topPackages = await HolidayPackage.aggregate([
            {
                $match: { averageRating: { $gt: 0 } } // Only consider packages with at least one review
            },
            {
                $sort: { averageRating: -1 } // Sort by average rating in descending order
            },
            {
                $limit: 5 // Limit to top 5 packages (adjustable)
            },
            {
                $lookup: {
                    from: 'reviews',
                    localField: 'reviews',
                    foreignField: '_id',
                    as: 'reviewDetails'
                }
            },
            {
                $project: {
                    title: 1,
                    averageRating: 1,
                    totalReviews: { $size: "$reviewDetails" }
                }
            }
        ]);

        return res.status(200).json({ topPackages });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const getReviewsForAnalysis = async (req, res, next) => {
    const {
        page = 1,
        limit = 10,
        rating,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        packageId
    } = req.query;

    const query = {};

    if (rating) query.rating = rating;
    if (packageId) query.holiday = packageId;

    try {
        const reviews = await Review.find(query)
            .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .populate('holiday', 'title') // Ensure correct population
            .exec();

        const totalReviews = await Review.countDocuments(query);

        if (!reviews.length) {
            return res.status(404).json({ message: 'No reviews found for analysis.' });
        }

        return res.status(200).json({
            reviews,
            totalReviews,
            totalPages: Math.ceil(totalReviews / limit),
            currentPage: page,
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createReview,
    getReviewsForPackage,
    getAverageRatingForPackage,
    getTotalReviewsCount,
    getTopRatedPackages,
    getReviewsForAnalysis
};