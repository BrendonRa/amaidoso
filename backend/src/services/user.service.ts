export class UserService {
  async create(data: any) {
    return { message: "Usuário criado", data };
  }
  async view() {
    return { message: "Entrou na base" }
  }
}