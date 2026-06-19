const { Router } = require('express');
const clienteController = require('../controllers/clienteController');

const router = Router();

router.get('/',              clienteController.listar);
router.get('/:id',           clienteController.buscarPorId);
router.post('/',             clienteController.criar);
router.put('/:id',           clienteController.atualizar);
router.delete('/:id',        clienteController.excluir);
router.post('/:id/enviar-relatorio', clienteController.enviarRelatorio);

module.exports = router;
