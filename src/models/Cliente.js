const db = require('../config/database');

const Cliente = {
  async findAll() {
    return await db.cliente.findMany({
      orderBy: { id: 'asc' },
    });
  },

  async findById(id, client = db) {
    return await client.cliente.findUnique({
      where: { id: Number(id) },
    });
  },

  async findByEmail(email) {
    return await db.cliente.findUnique({
      where: { email },
    });
  },

  async create({ nome, email, telefone }) {
    return await db.cliente.create({
      data: { nome, email, telefone },
    });
  },

  async update(id, { nome, email, telefone }) {
    return await db.cliente.update({
      where: { id: Number(id) },
      data: { nome, email, telefone },
    });
  },

  async delete(id) {
    return await db.cliente.delete({
      where: { id: Number(id) },
    });
  },
};

module.exports = Cliente;
