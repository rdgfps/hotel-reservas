const { Router } = require('express');
const authController = require('../controllers/authController');
const { autenticar } = require('../middlewares/authMiddleware');

const router = Router();

router.post('/login', authController.login);
router.post('/recuperar-senha', authController.solicitarRecuperacao);
router.post('/alterar-senha-recuperacao', authController.alterarSenhaRecuperacao);
router.post('/alterar-senha', autenticar, authController.alterarSenha);

module.exports = router;
