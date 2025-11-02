const { Router } = require('express')
const { drugController } = require('../controllers')
const { auth } = require('../middlewares')

const router = Router();

router.get('/', auth, drugController.getDrugs)
    .get('/byName', auth, drugController.getDrugByName)
    .post('/add', auth, drugController.addDrug)
    .put('/update/:id', auth, drugController.updateDrug)
    .delete('/delete/:id', auth, drugController.removeDrug)

module.exports = router