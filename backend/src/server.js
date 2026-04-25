const app = require('./app');
const { port } = require('./config/env');
const { checkDatabaseConnection } = require('./config/database');

async function start() {
  try {
    await checkDatabaseConnection();

    app.listen(port, () => {
      console.log(`Amaidoso backend rodando na porta ${port}`);
    });
  } catch (error) {
    console.error('Falha ao iniciar o backend:', error.message);
    process.exit(1);
  }
}

start();
