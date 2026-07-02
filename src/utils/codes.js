const crypto = require('crypto');

function gerarCodigo(tamanho = 32) {
  return crypto.randomBytes(tamanho).toString('hex');
}

module.exports = { gerarCodigo };
