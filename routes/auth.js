const { Router } = require('express')
const { authController } = require('../controllers')

const router = Router()

router.post('/login', authController.login)
    .post('/logout', authController.logout);
module.exports = router