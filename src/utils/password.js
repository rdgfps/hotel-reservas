const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

function criarHashSenha(senha) {
  return bcrypt.hashSync(senha, SALT_ROUNDS);
}

function senhaConfere(senha, senhaSalva) {
  if (!senhaSalva || !String(senhaSalva).startsWith('$2')) {
    return false;
  }

  return bcrypt.compareSync(senha, senhaSalva);
}

function senhaForte(senha) {
  return (
    typeof senha === 'string' &&
    senha.length >= 8 &&
    /[a-z]/.test(senha) &&
    /[A-Z]/.test(senha) &&
    /\d/.test(senha) &&
    /[^A-Za-z0-9]/.test(senha)
  );
}

function senhasParecidas(senhaAtual, novaSenha) {
  const atual = String(senhaAtual);
  const nova = String(novaSenha);
  let diferencas = Math.abs(atual.length - nova.length);
  const limite = Math.min(atual.length, nova.length);

  for (let i = 0; i < limite; i += 1) {
    if (atual[i] !== nova[i]) {
      diferencas += 1;
    }
  }

  return diferencas < 2;
}

module.exports = {
  criarHashSenha,
  senhaConfere,
  senhaForte,
  senhasParecidas,
};
