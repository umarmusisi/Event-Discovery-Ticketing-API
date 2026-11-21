const mongoose = require('mongoose');
const Event = require('../models/Event');
const Booking = require('../models/Booking');

/*
// CREATE BOOKING
const createBooking = async (req, res) => {
    try {
        const { attendeeName, attendeeEmail, seats } = req.body;
        const eventId = req.params.id;

        // Validate the requested number of seats
        if (!Number.isInteger(seats) || seats < 1) {
            return res.status(400).json({
                success: false,
                message: 'Seats must be a positive whole number'
            });
        }

        // Check whether the event exists
        const existingEvent = await Event.findById(eventId);

        if (!existingEvent) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Check whether the event is cancelled
        if (existingEvent.status === 'cancelled') {
            return res.status(400).json({
                success: false,
                message: 'Cannot book a cancelled event'
            });
        }

        // Check whether the event date has passed
        if (existingEvent.date <= new Date()) {
            return res.status(400).json({
                success: false,
                message: 'Cannot book a past event'
            });
        }

        // Atomically reserve the requested seats
        const event = await Event.findOneAndUpdate(
            {
                _id: eventId,
                status: 'upcoming',
                date: { $gt: new Date() },
                $expr: {
                    $lte: [
                        { $add: ['$seatsBooked', seats] },
                        '$capacity'
                    ]
                }
            },
            {
                $inc: { seatsBooked: seats }
            },
            {
                new: true
            }
        );

        // Check whether the reservation succeeded
        if (!event) {
            return res.status(409).json({
                success: false,
                message: 'Insufficient seats available'
            });
        }

        // Create the booking record
        const booking = await Booking.create({
            event: eventId,
            attendeeName,
            attendeeEmail,
            seats
        });

        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            data: {
                booking,
                seatsRemaining: event.seatsRemaining
            }
        });

    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid event ID'
            });
        }

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
*/


// CREATE BOOKING WITH TRANSACTION
const createBooking = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        const { attendeeName, attendeeEmail, seats } = req.body;
        const eventId = req.params.id;

        // Validate requested seats
        if (!Number.isInteger(seats) || seats < 1) {
            return res.status(400).json({
                success: false,
                message: 'Seats must be a positive whole number'
            });
        }

        // Check whether the event exists
        const existingEvent = await Event.findById(eventId);

        if (!existingEvent) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        if (existingEvent.status === 'cancelled') {
            return res.status(400).json({
                success: false,
                message: 'Cannot book a cancelled event'
            });
        }

        if (existingEvent.date <= new Date()) {
            return res.status(400).json({
                success: false,
                message: 'Cannot book a past event'
            });
        }

        // Start transaction
        session.startTransaction();

        // Atomically reserve seats
        const event = await Event.findOneAndUpdate(
            {
                _id: eventId,
                status: 'upcoming',
                date: { $gt: new Date() },
                $expr: {
                    $lte: [
                        { $add: ['$seatsBooked', seats] },
                        '$capacity'
                    ]
                }
            },
            {
                $inc: { seatsBooked: seats }
            },
            {
                new: true,
                session
            }
        );

        if (!event) {
            await session.abortTransaction();

            return res.status(409).json({
                success: false,
                message: 'Insufficient seats available or event is no longer bookable'
            });
        }

        // Create booking inside the transaction
        const bookings = await Booking.create(
            [{
                event: eventId,
                attendeeName,
                attendeeEmail,
                seats
            }],
            { session }
        );

        // Commit transaction
        await session.commitTransaction();

        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            data: {
                booking: bookings[0],
                seatsRemaining: event.seatsRemaining
            }
        });

    } catch (error) {

        // Roll back changes if something fails
        if (session.inTransaction()) {
            await session.abortTransaction();
        }

        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid event ID'
            });
        }

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: error.message
        });

    } finally {
        // Release database session
        await session.endSession();
    }
};

// GET BOOKINGS FOR A SPECIFIC EVENT
const getEventBookings = async (req, res) => {
    try {
        const eventId = req.params.id;

        // Pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        // Check whether the event exists
        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Retrieve bookings for this event
        const bookings = await Booking.find({
            event: eventId
        })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Count all bookings for this event
        const totalBookings = await Booking.countDocuments({
            event: eventId
        });

        const totalPages = Math.ceil(totalBookings / limit);

        res.status(200).json({
            success: true,
            event: {
                id: event._id,
                title: event.title
            },
            pagination: {
                totalBookings,
                totalPages,
                currentPage: page,
                limit
            },
            data: bookings
        });

    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid event ID'
            });
        }

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Export controller
module.exports = {
    createBooking,
    getEventBookings
};