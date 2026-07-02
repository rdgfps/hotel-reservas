const db = require('../config/database');

function formatarReserva(reserva) {
  if (!reserva) {
    return null;
  }

  return {
    id: reserva.id,
    cliente_id: reserva.cliente_id,
    quarto_id: reserva.quarto_id,
    data_entrada: reserva.data_entrada,
    data_saida: reserva.data_saida,
    status: reserva.status,
    criado_em: reserva.criado_em,
    cliente_nome: reserva.cliente?.nome,
    cliente_email: reserva.cliente?.email,
    quarto_numero: reserva.quarto?.numero,
    quarto_tipo: reserva.quarto?.tipo,
    usuarioId: reserva.usuarioId,
    usuario_nome: reserva.usuario?.nome,
    usuario_email: reserva.usuario?.email,
  };
}

const Reserva = {
  async findAll() {
    const reservas = await db.reserva.findMany({
      include: { cliente: true, quarto: true, usuario: true },
      orderBy: { id: 'asc' },
    });

    return reservas.map(formatarReserva);
  },

  async findById(id, client = db) {
    const reserva = await client.reserva.findUnique({
      where: { id: Number(id) },
      include: { cliente: true, quarto: true, usuario: true },
    });

    return formatarReserva(reserva);
  },

  async findByClienteId(clienteId) {
    const reservas = await db.reserva.findMany({
      where: { cliente_id: Number(clienteId) },
      include: { quarto: true, usuario: true },
      orderBy: { data_entrada: 'asc' },
    });

    return reservas.map(formatarReserva);
  },

  async findConflito(quartoId, dataEntrada, dataSaida, excludeId = null, client = db) {
    const where = {
      quarto_id: Number(quartoId),
      data_entrada: { lt: new Date(dataSaida) },
      data_saida: { gt: new Date(dataEntrada) },
    };

    if (excludeId) {
      where.id = { not: Number(excludeId) };
    }

    return await client.reserva.findMany({
      where,
      select: { id: true },
    });
  },

  async create({ cliente_id, quarto_id, data_entrada, data_saida, status, usuarioId }, client = db) {
    return await client.reserva.create({
      data: {
        cliente_id: Number(cliente_id),
        quarto_id: Number(quarto_id),
        usuarioId: Number(usuarioId),
        data_entrada: new Date(data_entrada),
        data_saida: new Date(data_saida),
        status,
      },
    });
  },

  async update(id, { cliente_id, quarto_id, data_entrada, data_saida, status }) {
    return await db.reserva.update({
      where: { id: Number(id) },
      data: {
        cliente_id: Number(cliente_id),
        quarto_id: Number(quarto_id),
        data_entrada: new Date(data_entrada),
        data_saida: new Date(data_saida),
        status,
      },
    });
  },

  async delete(id, client = db) {
    return await client.reserva.delete({
      where: { id: Number(id) },
    });
  },
};

module.exports = Reserva;
