const app = require('./app');
const { port } = require('./config/env');
const { checkDatabaseConnection } = require('./config/database');

async function start() {
  try {
    await checkDatabaseConnection();

    app.listen(port, '0.0.0.0', () => {
      console.log(`Amaidoso backend rodando em http://0.0.0.0:${port}`);
    });
  } catch (error) {
    console.error('Falha ao iniciar o backend:', error.message);
    process.exit(1);
  }
}

start();
