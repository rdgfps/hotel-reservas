require('dotenv').config();
const express = require('express');

const clienteRoutes = require('./routes/clienteRoutes');
const quartoRoutes = require('./routes/quartoRoutes');
const reservaRoutes = require('./routes/reservaRoutes');
const authRoutes = require('./routes/authRoutes');
const logRoutes = require('./routes/logRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ success: true, message: 'API em funcionamento.' });
});

app.use('/clientes', clienteRoutes);
app.use('/quartos', quartoRoutes);
app.use('/reservas', reservaRoutes);
app.use('/auth', authRoutes);
app.use('/logs', logRoutes);
app.use('/usuarios', usuarioRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Rota nao encontrada.' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

module.exports = app;
