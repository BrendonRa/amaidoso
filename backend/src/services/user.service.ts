import { connection } from "../config/db"

export class UserService {
  async create(data: any) {
    const sql = 'INSERT INTO idoso (id_idoso, nome_idoso) VALUES (?, ?)';
    await connection.execute(sql, [4, 'joao@email.com']);
    return { message: "Usuário criado", data };
  }
  async view() {
    const rows = await connection.execute('SELECT * FROM idoso');
    console.log(rows);
    return { message: "Todos os Idoso", rows }
  }
}