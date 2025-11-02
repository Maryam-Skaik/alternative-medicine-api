const Joi = require('@hapi/joi');

const Pschema = Joi.object({
    name: Joi.string().min(3).max(500).required(),
    address: Joi.string().min(3).max(500).required()
})

module.exports = Pschema