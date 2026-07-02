const Usuario = require('../models/Usuario');
const logService = require('./logService');
const emailService = require('./emailService');
const { senhaConfere, criarHashSenha, senhaForte, senhasParecidas } = require('../utils/password');
const { gerarToken } = require('../utils/token');
const { gerarCodigo } = require('../utils/codes');

const MAX_TENTATIVAS = 3;

const authService = {
  async login({ email, senha }) {
    if (!email || !senha) {
      const erro = new Error('E-mail e senha sao obrigatorios.');
      erro.status = 400;
      throw erro;
    }

    const usuario = await Usuario.findByEmail(email.toLowerCase());
    if (!usuario) {
      const erro = new Error('Usuario ou senha invalidos.');
      erro.status = 401;
      throw erro;
    }

    if (usuario.status !== 'ATIVO') {
      await logService.registrar({
        descricao: 'Login bloqueado',
        complemento: `Usuario ${usuario.email} tentou acessar uma conta inativa.`,
        usuarioId: usuario.id,
      });

      const erro = new Error('Usuario inativo.');
      erro.status = 403;
      throw erro;
    }

    if (usuario.bloqueado) {
      await logService.registrar({
        descricao: 'Login bloqueado',
        complemento: `Usuario ${usuario.email} tentou acessar uma conta bloqueada.`,
        usuarioId: usuario.id,
      });

      const erro = new Error('Usuario bloqueado por tentativas invalidas.');
      erro.status = 403;
      throw erro;
    }

    if (!senhaConfere(senha, usuario.senha)) {
      const tentativas = usuario.tentativasInvalidas + 1;
      const bloqueado = tentativas >= MAX_TENTATIVAS;

      await Usuario.update(usuario.id, {
        tentativasInvalidas: tentativas,
        bloqueado,
      });

      await logService.registrar({
        descricao: 'Tentativa de login invalida',
        complemento: bloqueado
          ? `Usuario ${usuario.email} bloqueado apos ${tentativas} tentativas.`
          : `Senha invalida para o usuario ${usuario.email}.`,
        usuarioId: usuario.id,
      });

      const erro = new Error('Usuario ou senha invalidos.');
      erro.status = 401;
      throw erro;
    }

    const atualizado = await Usuario.update(usuario.id, {
      tentativasInvalidas: 0,
      bloqueado: false,
      ultimoLogin: new Date(),
    });

    await logService.registrar({
      descricao: 'Login realizado',
      complemento: `Usuario ${usuario.email} realizou login com sucesso.`,
      usuarioId: usuario.id,
    });

    return {
      usuario: {
        id: atualizado.id,
        nome: atualizado.nome,
        email: atualizado.email,
        nivel: atualizado.nivel,
        ultimoLogin: atualizado.ultimoLogin,
      },
      token: gerarToken(atualizado),
    };
  },

  async solicitarRecuperacao({ email }) {
    if (!email) {
      const erro = new Error('E-mail e obrigatorio.');
      erro.status = 400;
      throw erro;
    }

    const usuario = await Usuario.findByEmail(email.toLowerCase());
    if (!usuario) {
      const erro = new Error('Usuario nao encontrado.');
      erro.status = 404;
      throw erro;
    }

    const codigo = gerarCodigo(6);
    const expiraEm = new Date(Date.now() + 1000 * 60 * 30);

    await Usuario.update(usuario.id, {
      codigoRecuperacao: codigo,
      recuperacaoExpiraEm: expiraEm,
    });

    await emailService.enviarCodigoRecuperacao(usuario.email, codigo);

    await logService.registrar({
      descricao: 'Recuperacao solicitada',
      complemento: `Codigo de recuperacao enviado para ${usuario.email}.`,
      usuarioId: usuario.id,
    });

    return { message: 'Codigo de recuperacao enviado.' };
  },

  async alterarSenhaRecuperacao({ codigo, novaSenha }) {
    if (!codigo || !novaSenha) {
      const erro = new Error('Codigo e nova senha sao obrigatorios.');
      erro.status = 400;
      throw erro;
    }

    if (!senhaForte(novaSenha)) {
      const erro = new Error('A nova senha deve ter no minimo 8 caracteres, letra maiuscula, letra minuscula, numero e simbolo.');
      erro.status = 400;
      throw erro;
    }

    const usuario = await Usuario.findByCodigoRecuperacao(codigo);
    if (!usuario || !usuario.recuperacaoExpiraEm || usuario.recuperacaoExpiraEm < new Date()) {
      const erro = new Error('Codigo de recuperacao invalido ou expirado.');
      erro.status = 400;
      throw erro;
    }

    await Usuario.update(usuario.id, {
      senha: criarHashSenha(novaSenha),
      codigoRecuperacao: null,
      recuperacaoExpiraEm: null,
      tentativasInvalidas: 0,
      bloqueado: false,
    });

    await logService.registrar({
      descricao: 'Senha recuperada',
      complemento: `Usuario ${usuario.email} alterou a senha por recuperacao.`,
      usuarioId: usuario.id,
    });

    return { message: 'Senha alterada.' };
  },

  async alterarSenha(usuarioId, { senhaAtual, novaSenha }) {
    const usuario = await Usuario.findById(usuarioId);

    if (!usuario || !senhaConfere(senhaAtual, usuario.senha)) {
      const erro = new Error('Senha atual invalida.');
      erro.status = 401;
      throw erro;
    }

    if (!senhaForte(novaSenha)) {
      const erro = new Error('A nova senha deve ter no minimo 8 caracteres, letra maiuscula, letra minuscula, numero e simbolo.');
      erro.status = 400;
      throw erro;
    }

    if (senhasParecidas(senhaAtual, novaSenha)) {
      const erro = new Error('A nova senha deve ser diferente da senha atual.');
      erro.status = 400;
      throw erro;
    }

    await Usuario.update(usuario.id, { senha: criarHashSenha(novaSenha) });

    await logService.registrar({
      descricao: 'Senha alterada',
      complemento: `Usuario ${usuario.email} alterou a senha.`,
      usuarioId: usuario.id,
    });

    return { message: 'Senha alterada.' };
  },
};

module.exports = authService;
