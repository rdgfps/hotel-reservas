const { ZodError } = require('zod');

function validar(schema, data) {
  const resultado = schema.safeParse(data);

  if (resultado.success) {
    return resultado.data;
  }

  const mensagens = resultado.error.issues.map((issue) => issue.message);
  const erro = new Error(mensagens.join(' '));
  erro.status = 400;
  throw erro;
}

module.exports = { validar, ZodError };
