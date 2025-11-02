const { schema, loginSchema } = require('./user');
const drugSchema  = require('./drug');
const pharmacySchema  = require('./pharmacy');

module.exports = {
    userValidator: schema,
    loginValidator: loginSchema,
    drugValidator: drugSchema,
    pharmacyValidator: pharmacySchema 
}