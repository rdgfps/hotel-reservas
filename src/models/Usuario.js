const db = require('../config/database');

const Usuario = {
  async findAll() {
    return await db.usuario.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        nivel: true,
        status: true,
        bloqueado: true,
        tentativasInvalidas: true,
        ultimoLogin: true,
        createdAt: true,
      },
      orderBy: { id: 'asc' },
    });
  },

  async findById(id, client = db) {
    return await client.usuario.findUnique({
      where: { id: Number(id) },
    });
  },

  async findByEmail(email, client = db) {
    return await client.usuario.findUnique({
      where: { email },
    });
  },

  async findByCodigoAtivacao(codigo) {
    return await db.usuario.findFirst({
      where: { codigoAtivacao: codigo },
    });
  },

  async findByCodigoRecuperacao(codigo) {
    return await db.usuario.findFirst({
      where: { codigoRecuperacao: codigo },
    });
  },

  async create({ nome, email, senha, nivel = 1, status = 'INATIVO', codigoAtivacao = null }) {
    return await db.usuario.create({
      data: { nome, email, senha, nivel, status, codigoAtivacao },
      select: {
        id: true,
        nome: true,
        email: true,
        nivel: true,
        status: true,
        codigoAtivacao: true,
        createdAt: true,
      },
    });
  },

  async update(id, data, client = db) {
    return await client.usuario.update({
      where: { id: Number(id) },
      data,
    });
  },
};

module.exports = Usuario;
