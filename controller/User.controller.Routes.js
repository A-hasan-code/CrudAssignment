const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router(); // Capitalize 'Router'
const User = require('../models/User.model');
const catchAsyncError = require('../middleware/catchAsyncError');
const ErrorHandler = require('../utils/ErrorHandler');
const sendToken = require('../utils/SendToken');
const { isAuthenticated, isAdmin } = require('../middleware/Auth');
const bcrypt = require('bcryptjs');

// Register a new user
router.post('/register', async (req, res, next) => {
    const { name, email, password } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // If the user does not exist, create a new one
        const newUser = new User({ name, email, password });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        next(new ErrorHandler(error.message, 400));
    }
});

// User login
router.post('/login', catchAsyncError(async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new ErrorHandler('Please provide all fields!', 400));
        }
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return next(new ErrorHandler('Please provide the correct information', 400));
        }
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return next(new ErrorHandler('Please provide the correct information', 400));
        }
        sendToken(user, 201, res);
    } catch (error) {
        const Err = new ErrorHandler(error.message, 500);
        return next(Err);
    }
}));

// Get user by ID
router.get('/getUser', isAuthenticated, catchAsyncError(async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return next(new ErrorHandler("User doesn't exist", 400));
        }

        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}));

// Update user's email and name
router.put('/update-user/:id', isAuthenticated, catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const { name, email } = req.body;

    try {
        // Find user by ID
        const user = await User.findByIdAndUpdate(id, { name, email }, { new: true });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, message: 'User updated successfully', user });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
}));

// Get all users
router.get('/Users', isAuthenticated, isAdmin("admin"), catchAsyncError(async (req, res, next) => {
    try {
        const users = await User.find();

        res.status(200).json({ success: true, users });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
}));


router.put('/updateUserRole/:id', isAuthenticated, isAdmin("admin"), catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const { role } = req.body;

    try {
        // Find user by ID and update the role
        const user = await User.findByIdAndUpdate(id, { role }, { new: true });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, message: 'User role updated successfully', user });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
}));

// Delete user
router.delete('/deleteUser/:id', isAuthenticated, isAdmin("admin"), catchAsyncError(async (req, res, next) => {
    const { id } = req.params;

    try {
        // Find user by ID and delete
        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
}));
  //user 
  
// Logout route
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ success: true, message: 'Logged out successfully' });
});

module.exports = router;
