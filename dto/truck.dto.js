const Joi = require('joi');

const TruckDto = Joi.object({
    id: Joi.string().trim(),
    driver: Joi.string(),
    number_plate: Joi.string().required()
});

module.exports = TruckDto;