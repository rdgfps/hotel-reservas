const { z } = require('zod');

const tiposValidos = ['Simples', 'Duplo', 'Suite'];

const quartoSchema = z.object({
  numero: z.coerce
    .number({ error: 'O campo numero e obrigatorio.' })
    .int('O numero do quarto deve ser inteiro.')
    .positive('O numero do quarto deve ser positivo.'),
  tipo: z.enum(tiposValidos, {
    error: `Tipo invalido. Use: ${tiposValidos.join(', ')}.`,
  }),
});

module.exports = { quartoSchema, tiposValidos };
