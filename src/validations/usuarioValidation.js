const { z } = require('zod');
const { senhaForte } = require('../utils/password');

const usuarioSchema = z.object({
  nome: z
    .string({ error: 'O campo nome e obrigatorio.' })
    .trim()
    .min(1, 'O campo nome e obrigatorio.'),
  email: z
    .string({ error: 'O campo e-mail e obrigatorio.' })
    .trim()
    .email('Informe um e-mail valido.')
    .toLowerCase(),
  senha: z
    .string({ error: 'O campo senha e obrigatorio.' })
    .refine(
      senhaForte,
      'A senha deve ter no minimo 8 caracteres, letra maiuscula, letra minuscula, numero e simbolo.'
    ),
  nivel: z.coerce
    .number()
    .int('O nivel deve ser um numero inteiro.')
    .min(1, 'O nivel deve ser entre 1 e 3.')
    .max(3, 'O nivel deve ser entre 1 e 3.')
    .optional(),
});

module.exports = { usuarioSchema };
