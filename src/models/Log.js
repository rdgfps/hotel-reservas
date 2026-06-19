const db = require('../config/database');

function formatarLog(log) {
  return {
    id: log.id,
    descricao: log.descricao,
    complemento: log.complemento,
    createdAt: log.createdAt,
    usuarioId: log.usuarioId,
    usuario_nome: log.usuario?.nome,
    usuario_email: log.usuario?.email,
  };
}

const Log = {
  async create({ descricao, complemento, usuarioId }, client = db) {
    return await client.log.create({
      data: {
        descricao,
        complemento,
        usuarioId: Number(usuarioId),
      },
    });
  },

  async findAll() {
    const logs = await db.log.findMany({
      include: { usuario: true },
      orderBy: { createdAt: 'desc' },
    });

    return logs.map(formatarLog);
  },

  async findByUsuarioId(usuarioId) {
    const logs = await db.log.findMany({
      where: { usuarioId: Number(usuarioId) },
      include: { usuario: true },
      orderBy: { createdAt: 'desc' },
    });

    return logs.map(formatarLog);
  },
};

module.exports = Log;
