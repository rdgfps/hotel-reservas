const { Router } = require('express');
const reservaController = require('../controllers/reservaController');
const { autenticar, exigirNivel } = require('../middlewares/authMiddleware');

const router = Router();

router.get('/',       reservaController.listar);
router.get('/:id',    reservaController.buscarPorId);
router.post('/',      autenticar, reservaController.criar);
router.put('/:id',    reservaController.atualizar);
router.delete('/:id', autenticar, exigirNivel(3), reservaController.excluir);

module.exports = router;
