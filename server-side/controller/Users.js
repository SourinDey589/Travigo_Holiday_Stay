// controller/Users.js

// import the User file from models
const User = require('../models/users');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Booking = require('../models/tourBooking');
const HolidayPackages = require('../models/holidayPackage');

// Fetching Users
const getUsers = async (req, res, next) => {
    try {
        const users = await User.find({});
        return res.json({ users: users.map(user => user.toObject({ getters: true })) });
    } catch (err) {
        return res.status(500).json({ message: 'Fetching users failed, please try again later.' });
    }
};

// Register
const SignUp = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
    
        return res.status(422).json({ message: 'Invalid inputs passed, please check your data.' });
    }

    const { username, email, password, photo, role } = req.body;

    // hashimg password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    let existingUser
    try {
        existingUser = await User.findOne({ email: email })

    } catch (error) {
    
        return res.status(500).json({ message: 'Signing up failed, please try again later.' });
    }

    if (existingUser) {
    
        return res.status(422).json({ message: 'User exists already, please login instead.' });
    }

    const newUser = new User({ username, email, password: hash, role });

    try {
        await newUser.save();

        return res.status(201).json({ message: 'Sign Up Successful' });

    } catch (error) {
        return res.status(500).json({ message: 'Sign up failed, please try again.' });
    }
    
};

// Login
const SignIn = async (req, res, next) => {
    const email = req.body.email;

    try {
        // finding the user from the database
        const user = await User.findOne({ email });

        // checking the given email is exist ot not 
        if(!user){
            return res.status(400).json({ message: 'Invalid Email !' });
        }

        // if user is exist then check the password or compare the password
        const checkpassword = await bcrypt.compare(req.body.password, user.password);

        // if password is incorrect
        if(!checkpassword){
            return res.status(400).json({ message: 'Invalid Email or Password !'});
        }

        const { password, role, ...rest } = user._doc;

        // create jwt token
        const token = jwt.sign({ id: user._id, role: user.role}, process.env.JWT_SECRET_KEY, { expiresIn: "30d" });

        return res.cookie("accessToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Use secure cookies in production
            sameSite: 'Strict', // Adjust as necessary for cross-origin requests
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        }).json({ message: 'Logged in!',token, user: rest, role });

    } catch (error) {
        return res.status(400).json({ error: 'Unable to login , please try again.' });
    }
};

// Update User
const updateUser = async (req, res, next) => {
    const id = req.params.id;

    try {
        const updatedData = { ...req.body };

        // Check if a photo was uploaded
        if (req.file) {
            updatedData.photo = `/uploads/${req.file.filename}`;
        } else if (req.existingFilePath) {
            // If the file exists, use the existing file path
            updatedData.photo = req.existingFilePath.replace('uploads', '/uploads');
        }

        // Hash the password if provided
        if (updatedData.password) {
            const salt = bcrypt.genSaltSync(10);
            updatedData.password = bcrypt.hashSync(updatedData.password, salt);
        }

        const updatedUser = await User.findByIdAndUpdate(id, {
            $set: updatedData
        }, { new: true });

        return res.json({ message: 'User Updated Successfully', updatedUser });
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong, could not update your User.', error: error.message });
    }
};

// Delete User
const deleteUser = async (req, res, next) => {
    const id = req.params.id;

    try {
        await User.findByIdAndDelete(id);
        {/*if (post.owner.toString() !== req.User.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }*/}
        return res.json({ message: 'User Deleted'});
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

// Fetching Users By Id
const getUsersById = async (req, res, next) => {
    const id = req.params.id;
    
    try {
      const user = await User.findById(id);

      return res.json(user);
    } catch (err) {

        return res.status(500).json({ message: 'Fetching users failed, please try again later.' });
    }
};

// get my tour bookings
const getMyTourBooking = async (req, res, next) => {
    try {
        // Find all bookings for the user by userId
        const bookings = await Booking.find({ userId: req.params.id });

        // Extract the tour names from the bookings
        const tourNames = bookings.map(booking => booking.tourName);

        // Find all holiday packages that match these tour names
        const tours = await HolidayPackages.find({ title: { $in: tourNames } });

        // Combine booking information with the corresponding tour details
        res.status(200).json({
            message: 'All bookings and tours retrieved successfully',
            bookings: bookings.map(booking => booking.toObject({ getters: true })),
            tours: tours.map(tour => tour.toObject({ getters: true }))
        });
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong, please try again later.', error: error.message });
    }
};

// Get User Count
const getUserCount = async (req, res, next) => {
    try {
        const count = await User.countDocuments({});
        return res.json({ count });
    } catch (error) {
        return res.status(500).json({ message: 'Fetching user count failed, please try again later.', error: error.message });
    }
};

// Get Active Users
const getActiveUsers = async (req, res, next) => {
    try {
        const activeUsers = await User.find({ isActive: true });
        return res.json({ activeUsers: activeUsers.map(user => user.toObject({ getters: true })) });
    } catch (error) {
        return res.status(500).json({ message: 'Fetching active users failed, please try again later.', error: error.message });
    }
};

// Get Inactive Users
const getInactiveUsers = async (req, res, next) => {
    try {
        const inactiveUsers = await User.find({ isActive: false });
        return res.json({ inactiveUsers: inactiveUsers.map(user => user.toObject({ getters: true })) });
    } catch (error) {
        return res.status(500).json({ message: 'Fetching inactive users failed, please try again later.', error: error.message });
    }
};

// Add a New User (Admin-only)
const addUserByAdmin = async (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ message: 'Invalid inputs passed, please check your data.' });
    }

    const { username, email, password, photo, role } = req.body;

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    try {
        const newUser = new User({ username, email, password: hash, photo, role });
        await newUser.save();
        return res.status(201).json({ message: 'User added successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'User creation failed, please try again later.' });
    }
};

module.exports = { SignUp, SignIn, getUsers, updateUser, deleteUser, getUsersById, getMyTourBooking, getUserCount, getActiveUsers, getInactiveUsers, addUserByAdmin };