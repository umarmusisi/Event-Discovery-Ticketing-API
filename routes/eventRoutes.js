const express = require('express');

// Create Express Router
const router = express.Router();

// Import controller functions
const {
    createEvent,
    getEvents,
    getEventById,
    updateEvent,
    deleteEvent
} = require('../controllers/eventController');

// Import validation middleware and event schema
const validate = require('../middleware/validate');
const eventSchema = require('../validators/eventValidator');

// Import event query schema for filtering and sorting
const eventQuerySchema = require('../validators/eventQueryValidator');

// Create a new schema for updating events by making all fields optional
const updateEventSchema = eventSchema.fork(
    Object.keys(eventSchema.describe().keys),
    (field) => field.optional()
);

// CREATE EVENT
router.post('/', createEvent);

// GET ALL EVENTS
router.get('/', validate(eventQuerySchema, 'query'), getEvents);

// GET SINGLE EVENT BY ID
router.get('/:id', getEventById);

// UPDATE EVENT
router.put('/:id', updateEvent);

// DELETE EVENT
router.delete('/:id', deleteEvent);

// Export routes
module.exports = router;
