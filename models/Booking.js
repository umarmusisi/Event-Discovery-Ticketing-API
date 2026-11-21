const mongoose = require('mongoose');

// Define Booking Schema
const bookingSchema = new mongoose.Schema({

    // Reference to the Event being booked
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: [true, 'Event reference is required']
    },

    // Attendee name
    attendeeName: {
        type: String,
        required: [true, 'Attendee name is required'],
        trim: true
    },

    // Attendee email
    attendeeEmail: {
        type: String,
        required: [true, 'Attendee email is required'],
        trim: true,
        lowercase: true,
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            'Please provide a valid email address'
        ]
    },

    // Number of seats booked
    seats: {
        type: Number,
        required: [true, 'Number of seats is required'],
        min: [1, 'At least one seat must be booked'],
        validate: {
            validator: Number.isInteger,
            message: 'Seats must be a whole number'
        }
    }

}, {
    timestamps: true
});

// Create Booking Model
const Booking = mongoose.model('Booking', bookingSchema);

// Export Booking Model
module.exports = Booking;
