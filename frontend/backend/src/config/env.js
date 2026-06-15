const path = require('path');
const dotenv = require('dotenv');

dotenv.config({
  path: path.resolve(process.cwd(), '.env'),
});

function requireEnv(name, fallback) {
  const value = process.env[name] ?? fallback;

  if (value === undefined || value === '') {
    throw new Error(`A variável de ambiente ${name} não foi definida.`);
  }

  return value;
}

module.exports = {
  port: Number(process.env.PORT ?? 5141),
  db: {
    host: requireEnv('DB_HOST', '127.0.0.1'),
    port: Number(process.env.DB_PORT ?? 3306),
    user: requireEnv('DB_USER', 'root'),
    password: process.env.DB_PASSWORD ?? '',
    database: requireEnv('DB_NAME', 'amaidoso'),
  },
};
