const Joi = require('joi');

const eventSchema = Joi.object({

    title: Joi.string()
        .trim()
        .min(3)
        .max(150)
        .required(),

    description: Joi.string()
        .trim()
        .allow('')
        .optional(),

    category: Joi.string()
        .trim()
        .required(),

    city: Joi.string()
        .trim()
        .required(),

    venue: Joi.string()
        .trim()
        .required(),

    date: Joi.date()
        .greater('now')
        .required(),

    price: Joi.number()
        .min(0)
        .required(),

    capacity: Joi.number()
        .integer()
        .min(1)
        .required(),

    status: Joi.string()
        .valid('upcoming', 'cancelled')
        .optional()

});

module.exports = eventSchema;
