const Joi = require('@hapi/joi');

const drugValidator = Joi.object({
    name: Joi.string().min(3).max(500).required(),
    type: Joi.string().max(100).allow(null, ''),
    manufacturer: Joi.string().max(100).allow(null, ''),
    isAvailable: Joi.boolean().required(),
    note: Joi.string().max(500).allow(null, ''),
    alternative_of: Joi.string().hex().length(24).allow(null, ''),
    pharmacies: Joi.array().items(Joi.string().hex().length(24)).default([])
});


module.exports = drugValidator