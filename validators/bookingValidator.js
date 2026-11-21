const Joi = require('joi');

const bookingSchema = Joi.object({

    attendeeName: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required(),

    attendeeEmail: Joi.string()
        .trim()
        .email()
        .lowercase()
        .required(),

    seats: Joi.number()
        .integer()
        .min(1)
        .required()

});

module.exports = bookingSchema;
