const express = require('express')

module.exports = {
    global: (app) => {
        app.use((req, res, next) => {
            //some code
            next();
        })

        app.use(express.json())
    },
    auth: require('./auth')
}
