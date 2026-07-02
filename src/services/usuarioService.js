const Usuario = require('../models/Usuario');
const { usuarioSchema } = require('../validations/usuarioValidation');
const { validar } = require('../validations/validationError');
const { criarHashSenha } = require('../utils/password');
const { gerarCodigo } = require('../utils/codes');
const logService = require('./logService');
const emailService = require('./emailService');

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

    const codigoAtivacao = gerarCodigo(12);
    const criado = await Usuario.create({
      ...usuario,
      senha: criarHashSenha(usuario.senha),
      nivel: usuario.nivel || 1,
      codigoAtivacao,
    });

    await emailService.enviarAtivacao(criado.email, codigoAtivacao);

    await logService.registrar({
      descricao: 'Usuario cadastrado',
      complemento: `Usuario ${criado.email} cadastrado com status INATIVO.`,
      usuarioId: criado.id,
    });

    return criado;
  },

  async ativar(codigo) {
    const usuario = await Usuario.findByCodigoAtivacao(codigo);

    if (!usuario) {
      const erro = new Error('Codigo de ativacao invalido.');
      erro.status = 404;
      throw erro;
    }

    const ativado = await Usuario.update(usuario.id, {
      status: 'ATIVO',
      codigoAtivacao: null,
    });

    await logService.registrar({
      descricao: 'Usuario ativado',
      complemento: `Usuario ${ativado.email} ativou a conta.`,
      usuarioId: ativado.id,
    });

    return {
      id: ativado.id,
      nome: ativado.nome,
      email: ativado.email,
      status: ativado.status,
    };
  },
};

module.exports = usuarioService;
