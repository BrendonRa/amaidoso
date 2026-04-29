const express = require('express');
const cors = require('cors');
require('./config/env');

const healthRoutes = require('./routes/health');
const authRoutes = require('./routes/auth');
const idosoRoutes = require('./routes/idosos');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/health', healthRoutes);
app.use('/auth', authRoutes);
app.use('/idosos', idosoRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);

  return res.status(500).json({
    error: 'Erro interno do servidor.',
  });
});

module.exports = app;
