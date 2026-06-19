const { Router } = require('express');
const usuarioController = require('../controllers/usuarioController');

const router = Router();

router.get('/', usuarioController.listar);
router.post('/', usuarioController.criar);

module.exports = router;
