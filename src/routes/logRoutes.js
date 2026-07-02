const { Router } = require('express');
const logController = require('../controllers/logController');
const { autenticar, exigirNivel } = require('../middlewares/authMiddleware');

const router = Router();

router.get('/', autenticar, exigirNivel(2), logController.listar);
router.get('/usuario', autenticar, exigirNivel(2), logController.pesquisarPorUsuario);
router.get('/usuario/:usuarioId', autenticar, exigirNivel(2), logController.pesquisarPorUsuario);

module.exports = router;
