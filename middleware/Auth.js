const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncError = require("./catchAsyncError");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model"); // Import the User model

exports.isAuthenticated = catchAsyncError(async (req, res, next) => {
    try {
        const token = req.cookies.token;
        console.log("Token:", token);

        if (!token) {
            return next(new ErrorHandler("Please login to continue", 401));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log("Decoded:", decoded);

        req.user = await User.findById(decoded.id);

        if (!req.user) {
            return next(new ErrorHandler("User not found", 404));
        }

        next();
    } catch (error) {
        console.error("Authentication Error:", error);
        return next(new ErrorHandler("Authentication failed", 401));
    }
});
exports.isAdmin = (...role) => {
    return (req, res, next) => {
        if (!role.includes(req.user.role)) {
            const Err = new ErrorHandler(`${req.user.role} can not access this resources!`);
            return next(Err);
        }
        next();
    };
};
