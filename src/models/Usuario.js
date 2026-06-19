const db = require('../config/database');

const Usuario = {
  async findAll() {
    return await db.usuario.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
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

  async create({ nome, email, senha }) {
    return await db.usuario.create({
      data: { nome, email, senha },
      select: {
        id: true,
        nome: true,
        email: true,
        createdAt: true,
      },
    });
  },
};

module.exports = Usuario;
