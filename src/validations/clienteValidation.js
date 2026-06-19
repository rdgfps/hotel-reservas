const { z } = require('zod');

const clienteSchema = z.object({
  nome: z
    .string({ error: 'O campo nome e obrigatorio.' })
    .trim()
    .min(1, 'O campo nome e obrigatorio.'),
  email: z
    .string({ error: 'O campo e-mail e obrigatorio.' })
    .trim()
    .email('Informe um e-mail valido.')
    .toLowerCase(),
  telefone: z
    .string()
    .trim()
    .optional()
    .or(z.literal('')),
});

module.exports = { clienteSchema };
