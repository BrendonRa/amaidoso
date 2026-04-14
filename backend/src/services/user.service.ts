import { connection } from "../config/db"

export class UserService {
  async create(data: any) {
    const sql = 'INSERT INTO idoso (nome_idoso, dt_nasc, sexo) VALUES (?, ?, ?)';
    connection.query(sql, [data.nome, data.dataNasc, data.sexo]);
    return { message: "Usuário criado", data };
  }
  async view() {
    const sql = 'SELECT * FROM idoso';
    const [rows] = await connection.query(sql);
    return rows;
  }
}