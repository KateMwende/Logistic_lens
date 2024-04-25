const Joi = require('joi');

const BagDto = Joi.object({
    description: Joi.string().min(3).required().disallow(""),
    id: Joi.string().trim(),
    weight: Joi.number().min(0).required(),
    units: Joi.string().valid('kgs', 'lbs').required(),
    truck_id: Joi.string().trim().required(),
});

module.exports = BagDto;