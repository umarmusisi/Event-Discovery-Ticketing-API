/*
// Import Helmet for security
const helmet = require('helmet');

// Import dotenv
require('dotenv').config();

// Import CORS for cross-origin requests
const cors = require('cors');

// Import Express
const express = require('express');

// Import database connection
const connectDB = require('./config/db');

// Import error handling middleware
const errorHandler = require('./middleware/errorHandler');

//import not found middleware
const notFound = require('./middleware/notFound');

// Import rate limiter middleware
const apiLimiter = require('./middleware/rateLimiter');

// Import morgan for logging HTTP requests
const morgan = require('morgan');

// Initialise Express
const app = express();

// Configure CORS
const allowedOrigins = process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(',').map(origin => origin.trim())
    : ['http://localhost:5173'];
    
// Apply CORS middleware
app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Use Helmet for security headers
app.use(helmet()); 

// Use morgan for logging HTTP requests
app.use(morgan('dev'));

// Middleware to parse JSON
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded data

// Apply rate limiting to all requests
app.use('/api', apiLimiter);

// Import event routes
const eventRoutes = require('./routes/eventRoutes');

// Import booking routes
const bookingRoutes = require('./routes/bookingRoutes');

// Register event routes
app.use('/api/events', eventRoutes);

// Register booking routes
app.use('/api/events', bookingRoutes);

// Handle undefined routes
app.use(notFound);

// Centralized error handling
app.use(errorHandler);

// Basic test route
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Event Discovery API is running'
    });
});

// Start application
const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectDB();

        // Start Express server
        app.listen(process.env.PORT || 3004, () => {
            console.log(`Server running on port ${process.env.PORT || 3004}`);
        });

    } catch (error) {
        console.error('Server startup failed:', error.message);
        process.exit(1);
    }
};

// Execute server
startServer();
*/

//Review: The code snippet provided is a comprehensive setup for an Express.js server with various middleware and configurations. It includes security measures, CORS configuration, request logging, error handling, and route management. The use of environment variables for configuration is a good practice, allowing for flexibility across different environments (development, production, etc.).

// Load environment variables
require('dotenv').config();

// Import Express
const express = require('express');

// Import security middleware
const helmet = require('helmet');
const cors = require('cors');

// Import request logger
const morgan = require('morgan');

// Import database connection
const connectDB = require('./config/db');

// Import custom middleware
const apiLimiter = require('./middleware/rateLimiter');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const eventRoutes = require('./routes/eventRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

// Initialize Express
const app = express();

// Configure allowed frontend origins
const allowedOrigins = process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(',').map(origin => origin.trim())
    : ['http://localhost:5173'];

// Security headers
app.use(helmet());

// CORS configuration
app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// HTTP request logging
app.use(morgan('dev'));

// Parse incoming request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use('/api', apiLimiter);

// Root endpoint
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Event Discovery API is running'
    });
});

// Event routes
app.use('/api/events', eventRoutes);

// Booking routes
app.use('/api/events', bookingRoutes);

// Handle undefined routes
app.use(notFound);

// Centralized error handling
app.use(errorHandler);

// Define server port
const PORT = process.env.PORT || 3004;

// Start server
const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
        });

    } catch (error) {
        console.error('Server startup failed:', error.message);
        process.exit(1);
    }
};

// Start the application
startServer();