const authRouter = require('./auth')
const drugRouter = require('./drug')
const pharmacyRouter = require('./pharmacy')

module.exports = (app) =>{
    app.use('/auth', authRouter)

    app.use('/drugs', drugRouter)

    app.use('/pharmacies', pharmacyRouter)
}