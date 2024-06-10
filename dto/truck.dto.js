const Joi = require('joi');

const TruckDto = Joi.object({
    id: Joi.string().trim(),
    driver: Joi.string().min(3).required(),
    number_plate: Joi.string().min(6).required(),
    capacityTonnes: Joi.number().min(0).required()
});

module.exports = TruckDto;