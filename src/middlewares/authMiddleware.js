const { verificarToken } = require('../utils/token');

function autenticar(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.replace('Bearer ', '')
    : null;

  const usuario = verificarToken(token);

  if (!usuario) {
    return res.status(401).json({
      success: false,
      message: 'Token invalido ou ausente.',
    });
  }

  req.usuario = usuario;
  return next();
}

function exigirNivel(nivelMinimo) {
  return (req, res, next) => {
    if (!req.usuario || req.usuario.nivel < nivelMinimo) {
      return res.status(403).json({
        success: false,
        message: 'Usuario sem permissao para esta acao.',
      });
    }

    return next();
  };
}

module.exports = { autenticar, exigirNivel };
