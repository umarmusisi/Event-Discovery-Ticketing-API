const Joi = require('joi');

const eventQuerySchema = Joi.object({

    page: Joi.number()
        .integer()
        .min(1)
        .default(1),

    limit: Joi.number()
        .integer()
        .min(1)
        .max(100)
        .default(10),

    sort: Joi.string()
        .valid('asc', 'desc')
        .default('asc'),

    search: Joi.string()
        .trim()
        .allow(''),

    city: Joi.string()
        .trim(),

    category: Joi.string()
        .trim(),

    from: Joi.date(),

    to: Joi.date()

}).custom((value, helpers) => {

    if (value.from && value.to && value.from > value.to) {
        return helpers.error('date.range');
    }

    return value;

}).messages({
    'date.range': '"from" date cannot be later than "to" date'
});

module.exports = eventQuerySchema;
