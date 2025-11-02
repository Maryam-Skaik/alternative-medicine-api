const { Router } = require('express')
const { pharmacyController } = require('../controllers')
const { auth } = require('../middlewares')

const router = Router();

router.get('/', auth, pharmacyController.getPharmacies)
    .get('/pages', auth, pharmacyController.getPharmaciesPageCount)
    .get('/:id', auth, pharmacyController.getPharmacyById)
    .post('/add', auth, pharmacyController.add)
    .put('/update/:id', auth, pharmacyController.update)
    .delete('/delete/:id', auth, pharmacyController.remove)

module.exports = router