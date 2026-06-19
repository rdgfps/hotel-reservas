const db = require('../config/database');

const Quarto = {
  async findAll() {
    return await db.quarto.findMany({
      orderBy: { numero: 'asc' },
    });
  },

  async findById(id, client = db) {
    return await client.quarto.findUnique({
      where: { id: Number(id) },
    });
  },

  async findByNumero(numero) {
    return await db.quarto.findUnique({
      where: { numero: Number(numero) },
    });
  },

  async create({ numero, tipo }) {
    return await db.quarto.create({
      data: { numero: Number(numero), tipo },
    });
  },

  async update(id, { numero, tipo }) {
    return await db.quarto.update({
      where: { id: Number(id) },
      data: { numero: Number(numero), tipo },
    });
  },

  async delete(id) {
    return await db.quarto.delete({
      where: { id: Number(id) },
    });
  },
};

module.exports = Quarto;
