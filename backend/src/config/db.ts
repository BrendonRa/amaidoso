import mysql from "mysql2/promise";

export const connection = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "amaidoso"
})


connection.getConnection()
  .then(() => {
    console.log('Conectado ao MySQL!');
  })
  .catch((err: any) => {
    console.error('Erro ao conectar:', err);
  });