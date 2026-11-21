/*
const errorHandler = (err, req, res, next) => {

    console.error(err.stack);

    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });

};

module.exports = errorHandler;
*/

/*
const errorHandler = (err, req, res, next) => {

    console.error(err.stack);

    let statusCode = err.statusCode || 500;
    let message = process.env.NODE_ENV === 'production'
    ? 'Internal Server Error'
    : err.message || 'Internal Server Error';

   // let message = err.message || 'Internal Server Error';

    // Invalid MongoDB ObjectId
    if (err.name === 'CastError') {
        statusCode = 400;
        message = 'Invalid resource ID';
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = Object.values(err.errors)
            .map(error => error.message)
            .join(', ');
    }

    // Duplicate MongoDB record
    if (err.code === 11000) {
        statusCode = 409;
        message = 'A record with this value already exists';
    }

    res.status(statusCode).json({
        success: false,
        message
    });

};

module.exports = errorHandler;
*/

const errorHandler = (err, req, res, next) => {

    console.error(err.stack);

    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    // Invalid MongoDB ObjectId
    if (err.name === 'CastError') {
        statusCode = 400;
        message = 'Invalid resource ID';
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = Object.values(err.errors)
            .map(error => error.message)
            .join(', ');
    }

    // Duplicate MongoDB record
    if (err.code === 11000) {
        statusCode = 409;
        message = 'A record with this value already exists';
    }

    // Hide unexpected internal errors in production
    if (statusCode >= 500 && process.env.NODE_ENV === 'production') {
        message = 'Internal Server Error';
    }

    res.status(statusCode).json({
        success: false,
        message
    });

};

module.exports = errorHandler;