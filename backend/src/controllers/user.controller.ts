import { Request, Response } from "express";
import { UserService } from "../services/user.service";

export class UserController {
  async create(req: Request, res: Response) {
    try {
      const { nome, dataNasc, sexo } = req.body;   
      const service = new UserService();
      const user = service.create({nome, dataNasc, sexo});
      console.log(user)
      return res.status(201).json(user);
    } catch(error) {
      return res.status(500).json({ message: error });
    }
  }
  async view(req: Request, res: Response) {
    const service = new UserService();
    const allUsers = await service.view().then();
    console.log(allUsers)
    return res.status(201).json(allUsers);
  }
}