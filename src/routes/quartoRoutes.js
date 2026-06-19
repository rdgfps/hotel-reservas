const { Router } = require('express');
const quartoController = require('../controllers/quartoController');

const router = Router();

router.get('/',       quartoController.listar);
router.get('/:id',    quartoController.buscarPorId);
router.post('/',      quartoController.criar);
router.put('/:id',    quartoController.atualizar);
router.delete('/:id', quartoController.excluir);

module.exports = router;
