const Joi = require('joi');

const UserDto = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string()
});

module.exports = UserDto;