import { connection } from "../config/db";

export class UserService {
  async create(data: any, type: string) {
    const sql = `INSERT INTO ${type} (${Object.keys(data).join(', ')}) VALUES (${Object.values(data).map(() => '?').join(', ')})`;
    connection.query(sql, Object.values(data));
    return { message: "Usuário criado", data };
  }
  // Pega todas as informações de idosos do Banco de Dados
  async view(type: string) {
    const sql = `SELECT * FROM ${type}`;
    const [rows] = await connection.query(sql);
    return rows;
  }
  // Seleciona apenas um idoso da tabela IDOSO
  async select(id: String, type: string) {
    const sql = `SELECT * FROM ${type} WHERE id_${type} = (?)`;
    const [rows] = await connection.query(sql, [id]);
    return rows;
  }
  // Deleta um idoso da tabela IDOSO
  async delete(id: String) {
    const sql = 'DELETE FROM idoso WHERE id_idoso = (?)';
    await connection.query(sql, [id]);
    return { message: "Usuário deletado" };
  }
  async login(input1: String, input2: String, type: String) {
    let sql;
    if (type === "idoso") {
      sql = `SELECT * FROM ${type} WHERE cpf = (?) AND senha = (?)`;
    } else {
      sql = `SELECT * FROM ${type} WHERE email = (?) AND senha = (?)`;
    }
    const [rows] = await connection.query(sql, [input1, input2]);
    return rows;
  }
  async update(id: String, data: any, type: string) {
    const sql = `UPDATE ${type} 
    SET ${Object.keys(data).map(key => `${key} = ?`).join(', ')} 
    WHERE id_${type} = ?`;
    await connection.query(sql, [...Object.values(data), id]);
    return { message: "Dados atualizados", data };
  }
} 