const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config')


const sauceCtrl = require('../controllers/sauce');

//*** CRUD ***//

//route servant pour la method POST
router.post('/', auth, multer, sauceCtrl.createSauce );
//route servant pour la method GET d'un objet spécifique
router.get('/:id',auth, sauceCtrl.getOneSauce);
//route servant pour la method GET de tout les objets
router.get('/', auth, sauceCtrl.getAllSauce );
//route pour la method PUT
router.put('/:id',auth, multer, sauceCtrl.modifySauce);
//route pour la method DELETE
router.delete('/:id', auth, sauceCtrl.deleteSauce);

//***fin du CRUD ***/

module.exports = router;