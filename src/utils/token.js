const crypto = require('crypto');

const SEGREDO = process.env.JWT_SECRET || 'hotel-reservas-segredo-dev';
const EXPIRACAO_SEGUNDOS = 60 * 60 * 2;

function base64url(valor) {
  return Buffer.from(JSON.stringify(valor)).toString('base64url');
}

function assinar(conteudo) {
  return crypto
    .createHmac('sha256', SEGREDO)
    .update(conteudo)
    .digest('base64url');
}

function gerarToken(usuario) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const agora = Math.floor(Date.now() / 1000);
  const payload = {
    id: usuario.id,
    email: usuario.email,
    nivel: usuario.nivel,
    iat: agora,
    exp: agora + EXPIRACAO_SEGUNDOS,
  };

  const conteudo = `${base64url(header)}.${base64url(payload)}`;
  return `${conteudo}.${assinar(conteudo)}`;
}

function verificarToken(token) {
  const partes = String(token || '').split('.');

  if (partes.length !== 3) {
    return null;
  }

  const [header, payload, assinatura] = partes;
  const conteudo = `${header}.${payload}`;
  const assinaturaEsperada = assinar(conteudo);

  if (assinatura !== assinaturaEsperada) {
    return null;
  }

  const dados = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));

  if (dados.exp < Math.floor(Date.now() / 1000)) {
    return null;
  }

  return dados;
}

module.exports = { gerarToken, verificarToken };
