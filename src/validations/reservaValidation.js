const { z } = require('zod');

const statusValidos = ['PG', 'NPG'];

function dataValida(valor) {
  return !isNaN(new Date(valor).getTime());
}

const reservaSchema = z
  .object({
    cliente_id: z.coerce
      .number({ error: 'O campo cliente_id e obrigatorio.' })
      .int('O cliente_id deve ser inteiro.')
      .positive('O cliente_id deve ser positivo.'),
    quarto_id: z.coerce
      .number({ error: 'O campo quarto_id e obrigatorio.' })
      .int('O quarto_id deve ser inteiro.')
      .positive('O quarto_id deve ser positivo.'),
    data_entrada: z
      .string({ error: 'A data de entrada e obrigatoria.' })
      .refine(dataValida, 'Formato de data invalido. Use AAAA-MM-DD.'),
    data_saida: z
      .string({ error: 'A data de saida e obrigatoria.' })
      .refine(dataValida, 'Formato de data invalido. Use AAAA-MM-DD.'),
    status: z.enum(statusValidos, {
      error: `Status invalido. Use: ${statusValidos.join(' ou ')}.`,
    }),
  })
  .refine(
    (data) => new Date(data.data_saida) > new Date(data.data_entrada),
    {
      message: 'A data de saida deve ser posterior a data de entrada.',
      path: ['data_saida'],
    }
  );

module.exports = { reservaSchema, statusValidos };
