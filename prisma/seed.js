require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { criarHashSenha } = require('../src/utils/password');

const prisma = new PrismaClient();

async function main() {
  await prisma.usuario.upsert({
    where: { email: 'admin@hotel.com' },
    update: {
      senha: criarHashSenha('Admin@123'),
      nivel: 3,
      status: 'ATIVO',
      bloqueado: false,
      tentativasInvalidas: 0,
    },
    create: {
      nome: 'Administrador',
      email: 'admin@hotel.com',
      senha: criarHashSenha('Admin@123'),
      nivel: 3,
      status: 'ATIVO',
    },
  });

  await prisma.usuario.upsert({
    where: { email: 'recepcao@hotel.com' },
    update: {
      senha: criarHashSenha('Recepcao@123'),
      nivel: 2,
      status: 'ATIVO',
      bloqueado: false,
      tentativasInvalidas: 0,
    },
    create: {
      nome: 'Recepcao',
      email: 'recepcao@hotel.com',
      senha: criarHashSenha('Recepcao@123'),
      nivel: 2,
      status: 'ATIVO',
    },
  });

  await prisma.cliente.createMany({
    data: [
      { nome: 'Joao Silva', email: 'joao@email.com', telefone: '(53) 99999-0001' },
      { nome: 'Maria Santos', email: 'maria@email.com', telefone: '(53) 99999-0002' },
      { nome: 'Pedro Oliveira', email: 'pedro@email.com', telefone: '(53) 99999-0003' },
    ],
    skipDuplicates: true,
  });

  await prisma.quarto.createMany({
    data: [
      { numero: 101, tipo: 'Simples' },
      { numero: 102, tipo: 'Simples' },
      { numero: 201, tipo: 'Duplo' },
      { numero: 202, tipo: 'Duplo' },
      { numero: 301, tipo: 'Suite' },
    ],
    skipDuplicates: true,
  });

  const clienteJoao = await prisma.cliente.findUnique({ where: { email: 'joao@email.com' } });
  const clienteMaria = await prisma.cliente.findUnique({ where: { email: 'maria@email.com' } });
  const clientePedro = await prisma.cliente.findUnique({ where: { email: 'pedro@email.com' } });
  const quarto101 = await prisma.quarto.findUnique({ where: { numero: 101 } });
  const quarto201 = await prisma.quarto.findUnique({ where: { numero: 201 } });
  const quarto301 = await prisma.quarto.findUnique({ where: { numero: 301 } });

  const reservas = [
    {
      cliente_id: clienteJoao.id,
      quarto_id: quarto101.id,
      data_entrada: new Date('2025-07-10'),
      data_saida: new Date('2025-07-15'),
      status: 'PG',
    },
    {
      cliente_id: clienteMaria.id,
      quarto_id: quarto201.id,
      data_entrada: new Date('2025-07-12'),
      data_saida: new Date('2025-07-14'),
      status: 'NPG',
    },
    {
      cliente_id: clientePedro.id,
      quarto_id: quarto301.id,
      data_entrada: new Date('2025-08-01'),
      data_saida: new Date('2025-08-05'),
      status: 'PG',
    },
  ];

  for (const reserva of reservas) {
    const existente = await prisma.reserva.findFirst({
      where: {
        cliente_id: reserva.cliente_id,
        quarto_id: reserva.quarto_id,
        data_entrada: reserva.data_entrada,
        data_saida: reserva.data_saida,
      },
    });

    if (!existente) {
      await prisma.reserva.create({ data: reserva });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
