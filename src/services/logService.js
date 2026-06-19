const Log = require('../models/Log');

const USUARIO_PADRAO_ID = 1;

function resolverUsuarioId(usuarioId) {
  const id = Number(usuarioId);
  return Number.isInteger(id) && id > 0 ? id : USUARIO_PADRAO_ID;
}

const logService = {
  async registrar({ descricao, complemento, usuarioId }, client) {
    const log = await Log.create(
      {
        descricao,
        complemento,
        usuarioId: resolverUsuarioId(usuarioId),
      },
      client
    );

    console.log(`[LOG] ${descricao} | usuarioId=${log.usuarioId}`);

    return log;
  },

  async listar() {
    return await Log.findAll();
  },

  async pesquisarPorUsuario(usuarioId) {
    const id = Number(usuarioId);

    if (!Number.isInteger(id) || id <= 0) {
      const erro = new Error('Informe um id de usuario valido.');
      erro.status = 400;
      throw erro;
    }

    return await Log.findByUsuarioId(id);
  },
};

module.exports = logService;
