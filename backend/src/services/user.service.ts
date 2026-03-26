export class UserService {
  async create(data: any) {
    return { message: "Usuário criado", data };
  }
}