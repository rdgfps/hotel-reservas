const Cliente = require('../models/Cliente');
const { clienteSchema } = require('../validations/clienteValidation');
const { validar } = require('../validations/validationError');

const clienteService = {
  async listar() {
    return await Cliente.findAll();
  },

  async buscarPorId(id) {
    const cliente = await Cliente.findById(id);
    if (!cliente) {
      const erro = new Error('Cliente nao encontrado.');
      erro.status = 404;
      throw erro;
    }
    return cliente;
  },

  async criar(dados) {
    const { nome, email, telefone } = validar(clienteSchema, dados);

    const existente = await Cliente.findByEmail(email);
    if (existente) {
      const erro = new Error('Ja existe um cliente cadastrado com este e-mail.');
      erro.status = 409;
      throw erro;
    }

    return await Cliente.create({ nome, email, telefone });
  },

  async atualizar(id, dados) {
    await clienteService.buscarPorId(id);
    const { nome, email, telefone } = validar(clienteSchema, dados);

    const existente = await Cliente.findByEmail(email);
    if (existente && existente.id !== parseInt(id)) {
      const erro = new Error('Este e-mail ja esta em uso por outro cliente.');
      erro.status = 409;
      throw erro;
    }

    return await Cliente.update(id, { nome, email, telefone });
  },

  async excluir(id) {
    await clienteService.buscarPorId(id);

    try {
      return await Cliente.delete(id);
    } catch (err) {
      if (err.code === 'P2003') {
        const erro = new Error('Nao e possivel excluir este cliente porque ele possui reservas cadastradas.');
        erro.status = 409;
        throw erro;
      }

      throw err;
    }
  },
};

module.exports = clienteService;
