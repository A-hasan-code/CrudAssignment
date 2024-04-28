const express = require('express');
const app = express();
const ErrorHandler = require('./utils/ErrorHandler');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');

const corsOptions = {
  origin:  process.env.FRONTEND_URL , // Change this to your frontend URL
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files
app.use('/uploads', express.static('uploads'));

// Import and use API routes
const User = require('./controller/User.controller.Routes');
app.use("/api", User);

// Error handler
app.use(ErrorHandler);

// Load environment variables in development
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

module.exports = app;
