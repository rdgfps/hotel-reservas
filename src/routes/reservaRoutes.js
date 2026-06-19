const { Router } = require('express');
const reservaController = require('../controllers/reservaController');

const router = Router();

router.get('/',       reservaController.listar);
router.get('/:id',    reservaController.buscarPorId);
router.post('/',      reservaController.criar);
router.put('/:id',    reservaController.atualizar);
router.delete('/:id', reservaController.excluir);

module.exports = router;
