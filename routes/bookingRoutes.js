const express = require('express');
const router = express.Router();

// Import controller functions
const { 
    createBooking, 
    getEventBookings,
 } = require('../controllers/bookingController');

// Import validation middleware and booking schema
const validate = require('../middleware/validate');
const bookingSchema = require('../validators/bookingValidator');


// Create a booking for an event
router.post('/:id/book', validate(bookingSchema), createBooking);

// Get bookings for a specific event // Retrieve bookings for an event
router.get('/:id/bookings', getEventBookings);

module.exports = router;