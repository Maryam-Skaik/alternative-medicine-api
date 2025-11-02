const Joi = require('@hapi/joi')

const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    username: Joi.string().alphanum().min(4).max(15).required(),
    password: Joi.string()
        .pattern(new RegExp('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$'))
        .message("Password must contain at least one uppercase letter, one lowercase letter, one number, and be at least 8 characters long.")
        .required()
})

const loginSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
})

module.exports = {
    schema, 
    loginSchema
}