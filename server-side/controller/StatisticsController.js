// Import required models
const User = require('../models/users');
const TourBooking = require('../models/tourBooking');
const HolidayPackage = require('../models/holidayPackage');
// Assuming you have a LoginHistory model

const getDashboardData = async (req, res) => {
    try {
        // Fetch Total Revenue
        const revenueByUser = await TourBooking.aggregate([
            {
                $group: {
                    _id: "$userId",
                    totalRevenuePerUser: { $sum: "$totalAmount" }
                }
            },
            {
                $lookup: {
                    from: "users",
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
                    userId: "$_id",
                    totalRevenuePerUser: 1,
                    userName: "$userInfo.username" // Changed to `username` to match the model
                }
            }
        ]);

        const totalRevenueResult = await TourBooking.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalAmount" }
                }
            }
        ]);
        const totalRevenue = totalRevenueResult[0]?.totalRevenue || 0;

        // Fetch Total Bookings Count
        const totalBookings = await TourBooking.countDocuments({});

        // Fetch Revenue By Package
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

        // Fetch Monthly Revenue
        const monthlyRevenue = await TourBooking.aggregate([
            {
                $group: {
                    _id: { month: { $month: "$bookingDate" }, year: { $year: "$bookingDate" } },
                    totalRevenue: { $sum: "$price" }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 }
            }
        ]);

        // Fetch Top Booked Packages
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
                $limit: 5
            }
        ]);

        // Fetch Users Registered Per Month
        const usersRegisteredPerMonth = await User.aggregate([
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

       

        // Send response with all data
        res.status(200).json({
            totalRevenue,
            revenueByUser,
            totalBookings,
            revenueByPackage,
            monthlyRevenue,
            topPackages,
            usersRegisteredPerMonth,
            
        });

    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch dashboard data.', error: error.message });
    }
};

module.exports = { getDashboardData };