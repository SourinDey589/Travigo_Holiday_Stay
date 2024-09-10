// controller/TourBookings.js

// import the places file from models
const TourBooking = require('../models/tourBooking');
const HolidayPackage = require('../models/holidayPackage');

// Add New Tour Booking
const AddBooking = async (req, res, next) => {
    const newBooking = new TourBooking(req.body);

    try{
        const savedBooking = await newBooking.save();

        return res.status(201).json({ message: "Your Tour is Booked", tourBooking: savedBooking });

    } catch(error) {
        return res.status(500).json({ error: error.message })
        // res.status(500).json({ message: 'Creating place failed, please try again.' });
    }
    
};

// View All Bookings
const ViewBooking = async (req, res, next) => {
    try {
        const booking = await TourBooking.find({});

        return res.json(booking);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}; 

// View Bookings by ID
const ViewBookingById = async (req, res, next) => {
    const id = req.params.id;

    try {
        const booking = await TourBooking.findById(id);
        {/*if (post.owner.toString() !== req.User.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }*/}
        return res.json(booking);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

// Update Travel Places
const UpdateBooking = async (req, res, next) => {
    const id = req.params.id;

    try {
        const updatebooking = await TourBooking.findByIdAndUpdate(id, {
            $set: req.body
        }, { new: true });

        return res.json({ message: 'Booking Updated', updatebooking });
        
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong, could not update your Holiday Package.' });
    }

};

// Delete Booking
const DeleteBooking = async (req, res, next) => {
    const id = req.params.id;

    try {
        await TourBooking.findByIdAndDelete(id);
        {/*if (post.owner.toString() !== req.User.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }*/}
        return res.json({ message: 'Booking Deleted'});
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

// Get Total Revenue
const GetTotalRevenue = async (req, res, next) => {
    try {
        // Single aggregation to calculate both user-specific and total revenue
        const revenueAggregation = await TourBooking.aggregate([
            {
                $group: {
                    _id: "$userId", // Group by userId
                    totalRevenuePerUser: { $sum: "$totalAmount" } // Calculate total revenue per user
                }
            },
            {
                $lookup: {
                    from: "users", // Assuming your user collection is called "users"
                    localField: "_id",
                    foreignField: "_id",
                    as: "userInfo"
                }
            },
            {
                $unwind: "$userInfo"
            },
            {
                $project: {
                    _id: 0, // Don't return the userId as _id, format the response
                    userId: "$_id",
                    totalRevenuePerUser: 1,
                    userName: "$userInfo.name" // Extract the user name
                }
            }
        ]);

        // Aggregation to calculate the total revenue across all bookings
        const totalRevenueResult = await TourBooking.aggregate([
            {
                $group: {
                    _id: null, // No grouping, just summing across all bookings
                    totalRevenue: { $sum: "$totalAmount" }
                }
            }
        ]);

        // Handle cases where there may be no bookings
        const totalRevenue = totalRevenueResult[0]?.totalRevenue || 0;

        // Return the results in a structured format
        res.status(200).json({
            totalRevenue,
            revenueByUser: revenueAggregation
        });
    } catch (err) {
        console.error('Error fetching total revenue:', err);
        res.status(500).json({
            message: 'Failed to fetch total revenue',
            error: err.message
        });
    }
};



// Get Total Bookings Count
const GetTotalBookingsCount = async (req, res, next) => {
    try {
        const totalBookings = await TourBooking.countDocuments({});
        return res.json({ totalBookings });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch total bookings count.', error: error.message });
    }
};

// Get Revenue By Package
const GetRevenueByPackage = async (req, res, next) => {
    try {
        // Calculate revenue grouped by holiday package
        const revenueByPackage = await TourBooking.aggregate([
            {
                $group: {
                    _id: "$packageId",
                    totalRevenue: { $sum: "$price" },
                    totalBookings: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'holidaypackages',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'packageDetails'
                }
            },
            {
                $unwind: "$packageDetails"
            },
            {
                $project: {
                    packageName: "$packageDetails.title",
                    totalRevenue: 1,
                    totalBookings: 1
                }
            }
        ]);

        return res.json({ revenueByPackage });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to calculate revenue by package.', error: error.message });
    }
};

// Get Monthly Revenue
const GetMonthlyRevenue = async (req, res, next) => {
    try {
        // Calculate revenue grouped by month
        const monthlyRevenue = await TourBooking.aggregate([
            {
                $group: {
                    _id: { month: { $month: "$bookAt" }, year: { $year: "$bookAt" } },
                    totalRevenue: { $sum: "$totalAmount" }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 }
            }
        ]);

        return res.json({ monthlyRevenue });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to calculate monthly revenue.', error: error.message });
    }
};

// Get Top Booked Packages
const GetTopBookedPackages = async (req, res, next) => {
    try {
        const topPackages = await TourBooking.aggregate([
            {
                $group: {
                    _id: "$packageId",
                    totalBookings: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'holidaypackages',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'packageDetails'
                }
            },
            {
                $unwind: "$packageDetails"
            },
            {
                $project: {
                    packageName: "$packageDetails.title",
                    totalBookings: 1
                }
            },
            {
                $sort: { totalBookings: -1 }
            },
            {
                $limit: 5 // Adjust this value to get more or fewer top packages
            }
        ]);

        return res.json({ topPackages });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch top booked packages.', error: error.message });
    }
};

const GetTotalBookings = async (req, res, next) => {
    try {
        // Using the aggregate function to count the total number of bookings
        const totalBookings = await TourBooking.countDocuments();

        return res.json({ totalBookings });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch total bookings.', error: error.message });
    }
};

module.exports = { AddBooking, ViewBooking, ViewBookingById, UpdateBooking, DeleteBooking, GetTotalRevenue, GetTotalBookingsCount, GetRevenueByPackage, GetMonthlyRevenue, GetTopBookedPackages, GetTotalBookings };