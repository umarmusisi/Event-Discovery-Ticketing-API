const Event = require('../models/Event');

// CREATE EVENT
const createEvent = async (req, res) => {
    try {
        // Extract event details from the request body
        const {
            title,
            description,
            category,
            city,
            venue,
            date,
            price,
            capacity
        } = req.body;

        // Create a new event in MongoDB
        const event = await Event.create({
            title,
            description,
            category,
            city,
            venue,
            date,
            price,
            capacity
        });

        // Return successful response
        res.status(201).json({
            success: true,
            message: 'Event created successfully',
            data: event
        });

    } catch (error) {
        // Handle validation errors
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
/*
// GET ALL EVENTS
const getEvents = async (req, res) => {
    try {
        // Retrieve all events from MongoDB
        const events = await Event.find();

        // Return retrieved events
        res.status(200).json({
            success: true,
            count: events.length,
            data: events
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
*/
/*
// GET ALL EVENTS WITH PAGINATION AND SORTING
const getEvents = async (req, res) => {
    try {
        // Get pagination and sorting parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const sort = req.query.sort || 'asc';

        // Calculate how many records to skip
        const skip = (page - 1) * limit;

        // Determine sorting order
        const sortOrder = sort === 'desc' ? -1 : 1;

        // Retrieve events from MongoDB
        const events = await Event.find()
            .sort({ date: sortOrder })
            .skip(skip)
            .limit(limit);

        // Count total events
        const totalEvents = await Event.countDocuments();

        // Calculate total pages
        const totalPages = Math.ceil(totalEvents / limit);

        // Return response
        res.status(200).json({
            success: true,
            pagination: {
                totalEvents,
                totalPages,
                currentPage: page,
                limit
            },
            data: events
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
*/
// GET ALL EVENTS WITH SEARCH, FILTERING, PAGINATION AND SORTING

/*
const getEvents = async (req, res, next) => {
    try {
        // Extract query parameters
        const {
            page = 1,
            limit = 10,
            sort = 'asc',
            search,
            city,
            category,
            from,
            to
        } = req.query;

        // Convert pagination values to numbers
        const currentPage = parseInt(page);
        const pageLimit = parseInt(limit);

        // Calculate records to skip
        const skip = (currentPage - 1) * pageLimit;

        // Determine sorting order
        const sortOrder = sort === 'desc' ? -1 : 1;

        // Build MongoDB query
        const query = {};

        // Search by title and description
        if (search) {
            query.$text = {
                $search: search
            };
        }

        // Filter by city
        if (city) {
            query.city = new RegExp(`^${city}$`, 'i');
        }

        // Filter by category
        if (category) {
            query.category = new RegExp(`^${category}$`, 'i');
        }

        // Filter by date range
        if (from || to) {
            query.date = {};

            if (from) {
                query.date.$gte = new Date(from);
            }

            if (to) {
                query.date.$lte = new Date(to);
            }
        }

        // Retrieve matching events
        const events = await Event.find(query)
            .sort({ date: sortOrder })
            .skip(skip)
            .limit(pageLimit);

        // Count matching events
        const totalEvents = await Event.countDocuments(query);

        // Calculate total pages
        const totalPages = Math.ceil(totalEvents / pageLimit);

        // Return response
        res.status(200).json({
            success: true,
            pagination: {
                totalEvents,
                totalPages,
                currentPage,
                limit: pageLimit
            },
            filters: {
                search,
                city,
                category,
                from,
                to
            },
            data: events
        });

    }   catch (error) {
    next(error);
        }

};
*/
const getEvents = async (req, res, next) => {
    try {
        const {
            page = 1,
            limit = 10,
            sort = 'asc',
            search,
            city,
            category,
            from,
            to
        } = req.query;

        // Convert pagination values to numbers
        const currentPage = Number(page);
        const pageLimit = Number(limit);

        // Validate pagination values
        if (!Number.isInteger(currentPage) || currentPage < 1) {
            return res.status(400).json({
                success: false,
                message: 'Page must be a positive integer'
            });
        }

        if (!Number.isInteger(pageLimit) || pageLimit < 1 || pageLimit > 100) {
            return res.status(400).json({
                success: false,
                message: 'Limit must be between 1 and 100'
            });
        }

        // Calculate pagination
        const skip = (currentPage - 1) * pageLimit;

        // Determine sort direction
        const sortOrder = sort === 'desc' ? -1 : 1;

        // Build query
        const query = {};

        if (search) {
            query.$text = { $search: search };
        }

        if (city) {
            query.city = new RegExp(`^${city}$`, 'i');
        }

        if (category) {
            query.category = new RegExp(`^${category}$`, 'i');
        }

        // Date filtering
        if (from || to) {
            query.date = {};

            if (from) {
                query.date.$gte = new Date(from);
            }

            if (to) {
                query.date.$lte = new Date(to);
            }
        }

        // Fetch events
        const events = await Event.find(query)
            .sort({ date: sortOrder, _id: sortOrder })
            .skip(skip)
            .limit(pageLimit);

        // Count matching events
        const totalEvents = await Event.countDocuments(query);

        // Calculate total pages
        const totalPages = Math.ceil(totalEvents / pageLimit);

        // Return response
        res.status(200).json({
            success: true,
            pagination: {
                totalEvents,
                totalPages,
                currentPage,
                limit: pageLimit,
                hasNextPage: currentPage < totalPages,
                hasPreviousPage: currentPage > 1 && currentPage <= totalPages
            },
            filters: {
                search,
                city,
                category,
                from,
                to
            },
            data: events
        });

    } catch (error) {
        next(error);
    }
};

// GET SINGLE EVENT BY ID
const getEventById = async (req, res) => {
    try {
        // Get event ID from URL
        const eventId = req.params.id;

        // Find event in MongoDB
        const event = await Event.findById(eventId);

        // Check whether event exists
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Return event details
        res.status(200).json({
            success: true,
            data: event
        });

    } catch (error) {
        // Handle invalid MongoDB ID
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid event ID'
            });
        }

        // Handle other errors
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// UPDATE EVENT
const updateEvent = async (req, res) => {
    try {
        const eventId = req.params.id;

        // Find the existing event
        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Only allow approved fields to be updated
        const allowedFields = [
            'title',
            'description',
            'category',
            'city',
            'venue',
            'date',
            'price',
            'capacity',
            'status'
        ];

        const updates = {};

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        // Prevent capacity from being reduced below booked seats
        if (
            updates.capacity !== undefined &&
            updates.capacity < event.seatsBooked
        ) {
            return res.status(400).json({
                success: false,
                message: `Capacity cannot be less than ${event.seatsBooked} booked seats`
            });
        }

        // Apply the updates
        const updatedEvent = await Event.findByIdAndUpdate(
            eventId,
            updates,
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json({
            success: true,
            message: 'Event updated successfully',
            data: updatedEvent
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

// DELETE EVENT
const deleteEvent = async (req, res) => {
    try {
        const eventId = req.params.id;

        // Check whether the event exists
        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Check whether the event has bookings
        const existingBookings = await Booking.exists({
            event: eventId
        });

        if (existingBookings) {
            return res.status(409).json({
                success: false,
                message: 'Cannot delete an event that has existing bookings'
            });
        }

        // Delete the event
        await Event.findByIdAndDelete(eventId);

        res.status(200).json({
            success: true,
            message: 'Event deleted successfully'
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
    createEvent,
    getEvents,
    getEventById,
    updateEvent,
    deleteEvent
};
