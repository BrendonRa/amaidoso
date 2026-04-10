import mysql from "mysql2/promise";

export const connection = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "amaidoso"
})


connection.getConnection((err) => {
  if (err) {
    console.error('Erro ao conectar:', err);
    return;
  }
  console.log('Conectado ao MySQL!');
});