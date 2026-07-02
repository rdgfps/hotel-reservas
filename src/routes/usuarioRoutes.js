const { Router } = require('express');
const usuarioController = require('../controllers/usuarioController');
const { autenticar, exigirNivel } = require('../middlewares/authMiddleware');

const router = Router();

router.get('/', autenticar, exigirNivel(2), usuarioController.listar);
router.post('/', usuarioController.criar);
router.get('/ativar/:codigo', usuarioController.ativar);

module.exports = router;
