const { Router } = require('express');
const logController = require('../controllers/logController');

const router = Router();

router.get('/', logController.listar);
router.get('/usuario', logController.pesquisarPorUsuario);
router.get('/usuario/:usuarioId', logController.pesquisarPorUsuario);

module.exports = router;
