const { z } = require('zod');

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
    .min(4, 'A senha deve ter pelo menos 4 caracteres.'),
});

module.exports = { usuarioSchema };
