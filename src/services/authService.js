const Usuario = require('../models/Usuario');
const logService = require('./logService');

const authService = {
  async login({ email, senha }) {
    if (!email || !senha) {
      const erro = new Error('E-mail e senha sao obrigatorios.');
      erro.status = 400;
      throw erro;
    }

    const usuario = await Usuario.findByEmail(email.toLowerCase());
    if (!usuario) {
      const erro = new Error('Usuario ou senha invalidos.');
      erro.status = 401;
      throw erro;
    }

    if (usuario.senha !== senha) {
      await logService.registrar({
        descricao: 'Tentativa de login invalida',
        complemento: `Senha invalida para o usuario ${usuario.email}.`,
        usuarioId: usuario.id,
      });

      const erro = new Error('Usuario ou senha invalidos.');
      erro.status = 401;
      throw erro;
    }

    await logService.registrar({
      descricao: 'Login realizado',
      complemento: `Usuario ${usuario.email} realizou login com sucesso.`,
      usuarioId: usuario.id,
    });

    return {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
    };
  },
};

module.exports = authService;
