import { connection } from "../config/db"

export class UserService {
  async create(data: any) {
    const sql = 'INSERT INTO idoso (nome_idoso, dt_nasc, sexo) VALUES (?, ?, ?)';
    connection.query(sql, [data.nome, data.dataNasc, data.sexo]);
    return { message: "Usuário criado", data };
  }
  async view() {
    const sql = 'SELECT * FROM idoso';
    const [rows] = connection.query(sql, (err, results) => {
      if (err) {
        return { erro: 'Erro no bansco' };
      }
      //console.log(results)
      return results; // Retorna os dados em JSON
    });
    return 
  }
}