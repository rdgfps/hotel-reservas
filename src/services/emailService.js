const transporter = require('../config/mailer');
const Cliente = require('../models/Cliente');
const Reserva = require('../models/Reserva');

const emailService = {
  async enviarRelatorio(clienteId) {
    const cliente = await Cliente.findById(clienteId);
    if (!cliente) {
      const erro = new Error('Cliente nao encontrado.');
      erro.status = 404;
      throw erro;
    }

    const reservas = await Reserva.findByClienteId(clienteId);

    const linhas = reservas
      .map(
        (reserva) => `
          <tr>
            <td>${reserva.id}</td>
            <td>${reserva.quarto_numero}</td>
            <td>${reserva.quarto_tipo}</td>
            <td>${new Date(reserva.data_entrada).toLocaleDateString('pt-BR')}</td>
            <td>${new Date(reserva.data_saida).toLocaleDateString('pt-BR')}</td>
            <td>${reserva.status === 'PG' ? 'Pago' : 'Pendente'}</td>
          </tr>`
      )
      .join('');

    const tabelaReservas = reservas.length
      ? `
        <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse; width:100%;">
          <thead>
            <tr>
              <th>Reserva</th>
              <th>Quarto</th>
              <th>Tipo</th>
              <th>Entrada</th>
              <th>Saida</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>${linhas}</tbody>
        </table>`
      : '<p>Nenhuma reserva encontrada.</p>';

    const html = `
      <div style="font-family: Arial, sans-serif; max-width:700px; margin:auto;">
        <h2>Reservas do cliente</h2>
        <p><strong>Cliente:</strong> ${cliente.nome}</p>
        <p><strong>E-mail:</strong> ${cliente.email}</p>
        <p><strong>Telefone:</strong> ${cliente.telefone || 'Nao informado'}</p>
        ${tabelaReservas}
        <p><strong>Total:</strong> ${reservas.length}</p>
      </div>
    `;

    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: cliente.email,
      subject: `Reservas - ${cliente.nome}`,
      html,
    });

    return {
      messageId: info.messageId,
      destinatario: cliente.email,
      reservasEnviadas: reservas.length,
    };
  },
};

module.exports = emailService;
