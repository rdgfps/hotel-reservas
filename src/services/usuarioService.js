const Usuario = require('../models/Usuario');
const { usuarioSchema } = require('../validations/usuarioValidation');
const { validar } = require('../validations/validationError');

const usuarioService = {
  async listar() {
    return await Usuario.findAll();
  },

  async criar(dados) {
    const usuario = validar(usuarioSchema, dados);

    const existente = await Usuario.findByEmail(usuario.email);
    if (existente) {
      const erro = new Error('Ja existe um usuario cadastrado com este e-mail.');
      erro.status = 409;
      throw erro;
    }

    return await Usuario.create(usuario);
  },
};

module.exports = usuarioService;
