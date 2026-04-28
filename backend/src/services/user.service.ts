import { connection } from "../config/db"

export class UserService {
  async create(data: any) {
    const sql = 'INSERT INTO idoso (nome_idoso, dt_nasc, sexo) VALUES (?, ?, ?)';
    connection.query(sql, [data.nome, data.dataNasc, data.sexo]);
    return { message: "Usuário criado", data };
  }
  // Pega todas as informações de idosos do Banco de Dados
  async view() {
    const sql = 'SELECT * FROM idoso';
    const [rows] = await connection.query(sql);
    return rows;
  }
  // Seleciona apenas um idoso da tabela IDOSO
  async select(id: String) {
    const sql = 'SELECT * FROM idoso WHERE id_idoso = (?)';
    const [rows] = await connection.query(sql, [id]);
    return rows;
  }
  // Deleta um idoso da tabela IDOSO
  async delete(id: String) {
    const sql = 'DELETE FROM idoso WHERE id_idoso = (?)';
    await connection.query(sql, [id]);
    return { message: "Usuário deletado" };
  }
}