// app.js

// Import necessary modules
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

dotenv.config();
const app = express();
const corsOptions = { origin: true, credentials: true };

// Set up multer storage with a check for existing files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
      const filePath = path.join('uploads', file.originalname);
      
      // Check if the file already exists
      if (fs.existsSync(filePath)) {
          // Use the existing file name if the file exists
          cb(null, file.originalname);
      } else {
          // Save the file with the original name
          cb(null, file.originalname);
      }
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
      // Check if the file already exists
      const filePath = path.join('uploads', file.originalname);
      if (fs.existsSync(filePath)) {
          req.existingFilePath = filePath; // Set the existing file path in the request
          cb(null, false); // Silently skip saving the file
      } else {
          cb(null, true); // Accept the file upload
      }
  },
});

// Middleware
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import the mongoose library
const mongoose = require('mongoose');
const { check } = require('express-validator');

// MongoDB connection
mongoose
    .connect('mongodb://localhost:27017')
    .then(() => console.log('MongoDB connected.'))
    .catch((err) => console.log(err));

// Import controller routes
const userController = require('./controller/Users');
const holidayController = require('./controller/HolidayPackages');
// const categoryController = require('./controller/Categories');
const bookingController = require('./controller/TourBookings');
// const verifyController = require('./utils/verifyToken');
const reviewController = require('./controller/Reviews');
const statisticsController = require('./controller/StatisticsController');

// User Routes
app.post(
    '/SignUp',
    [
        check('username').not().isEmpty(),
        check('email').normalizeEmail().isEmail(),
        check('password').isLength({ min: 4 }),
    ],
    userController.SignUp
);
app.post('/SignIn', userController.SignIn);

app.get('/Users', userController.getUsers);
app.get('/Users/:id', userController.getUsersById);
app.put('/Users/Update/:id', upload.single('photo'), userController.updateUser);
app.delete('/Users/Delete/:id', userController.deleteUser);
app.get('/MyBookings/:id', userController.getMyTourBooking);
app.get('/count', userController.getUserCount);
app.get('/active', userController.getActiveUsers);
app.post('/admin/add-user', userController.addUserByAdmin);

// Holiday Package Routes
app.post('/Tour/Add', upload.single('photo'), holidayController.AddPlace);
app.put('/Tour/Update/:id', holidayController.UpdatePlace);
app.delete('/Tour/Delete/:id', holidayController.DeletePlace);

app.get('/Tour/View', holidayController.ViewPlace);
app.get('/Tour/View/:id', holidayController.ViewPlaceById);
app.get('/Tour/Search', holidayController.ViewPlaceBySearch);
app.get('/Search/Featured', holidayController.ViewFeaturedPlace);
app.get('/Search/getTourCount', holidayController.getTourCount);

// Category Routes
// app.post('/Category/Add', categoryController.AddCategory);
// app.get('/Category/View', categoryController.ViewCategories);
// app.get('/Category/View/:id', categoryController.ViewCategoryById);
// app.put('/Category/Update/:id', categoryController.UpdateCategory);
// app.delete('/Category/Delete/:id', categoryController.DeleteCategory);

// Tour Booking Routes
app.post('/Booking/Add', bookingController.AddBooking);
app.get('/Booking/View', bookingController.ViewBooking);
app.get('/Booking/View/:id', bookingController.ViewBookingById);
app.put('/Booking/Update/:id', bookingController.UpdateBooking);
app.delete('/Booking/Delete/:id', bookingController.DeleteBooking);
app.get('/revenue', bookingController.GetTotalRevenue);
app.get('/GetRevenueByPackage', bookingController.GetRevenueByPackage);
app.get('/GetMonthlyRevenue', bookingController.GetMonthlyRevenue);
app.get('/GetTopBookedPackages', bookingController.GetTopBookedPackages);
app.get('/GetTotalbooking', bookingController.GetTotalBookings);

// Review Routes
app.post('/Review/Add/:id', reviewController.createReview);
app.get('/getReviewsForPackage', reviewController.getReviewsForPackage);
app.get('/getTopRatedPackages', reviewController.getTopRatedPackages);
app.get('/getTotalReviewsCount', reviewController.getTotalReviewsCount);
app.get('/analysereview', reviewController.getReviewsForAnalysis);

// Statistics Routes
app.get('/chart-data', statisticsController.getDashboardData);

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));