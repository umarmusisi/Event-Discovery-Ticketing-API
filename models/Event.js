const mongoose = require('mongoose');

// Define Event Schema
const eventSchema = new mongoose.Schema({

    // Event title
    title: {
        type: String,
        required: [true, 'Event title is required'],
        trim: true
    },

    // Event description
    description: {
        type: String,
        trim: true
    },

    // Event category
    category: {
        type: String,
        required: [true, 'Event category is required'],
        trim: true
    },

    // City where the event takes place
    city: {
        type: String,
        required: [true, 'City is required'],
        trim: true
    },

    // Physical venue
    venue: {
        type: String,
        required: [true, 'Venue is required'],
        trim: true
    },

    // Event date
    date: {
        type: Date,
        required: [true, 'Event date is required'],
        validate: {
            validator: function(value) {
                return value > new Date();
            },
            message: 'Event date must be in the future'
        }
    },

    // Ticket price
    price: {
        type: Number,
        required: [true, 'Ticket price is required'],
        min: [0, 'Price cannot be negative']
    },

    // Maximum event capacity
    capacity: {
        type: Number,
        required: [true, 'Event capacity is required'],
        min: [1, 'Capacity must be at least 1']
    },

    // Number of seats already booked
    seatsBooked: {
        type: Number,
        default: 0,
        min: [0, 'Seats booked cannot be negative']
    },

    // Event status
    status: {
        type: String,
        enum: ['upcoming', 'cancelled'],
        default: 'upcoming'
    }

}, {
    timestamps: true
});

// Create text index for event searching
eventSchema.index({
    title: 'text',
    description: 'text'
});

// Create index for city filtering
eventSchema.index({
    city: 1
});

// Calculate remaining seats
eventSchema.virtual('seatsRemaining').get(function() {
    return this.capacity - this.seatsBooked;
});

// Include virtual fields when converting documents to JSON
eventSchema.set('toJSON', {
    virtuals: true
});

eventSchema.set('toObject', {
    virtuals: true
});

// Create Event Model
const Event = mongoose.model('Event', eventSchema);

// Export Event Model
module.exports = Event;
