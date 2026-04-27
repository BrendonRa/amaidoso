import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { Responsavel } from "../models/user.model";

export class UserController {
  async create(req: Request, res: Response) {
    try {
      const { ...Responsavel } : Responsavel = req.body;   
      const service = new UserService();
      const user = service.create({...Responsavel}, "responsavel");
      console.log(user)
      return res.status(201).json(user);
    } catch(error) {
      return res.status(500).json({ message: error });
    }
  }
  async view(req: Request, res: Response) {
    const service = new UserService();
    const allUsers = await service.view("responsavel").then();
    console.log(allUsers);
    return res.status(201).json(allUsers);
  }
  async select(req: Request, res: Response) {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const service = new UserService();
    const userSelecter = await service.select(id, "responsavel").then();
    console.log(userSelecter);
    return res.status(201).json(userSelecter)
  }
  async login(req: Request, res: Response) {
    const email = Array.isArray(req.params.email) ? req.params.email[0] : req.params.email;
    const senha = Array.isArray(req.params.senha) ? req.params.senha[0] : req.params.senha;
    const service = new UserService();
    const userLogin = await service.login(email, senha, "responsavel").then();
    console.log(userLogin);
    return res.status(201).json(userLogin)
  }
  async update(req: Request, res: Response) {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const data = req.body;
    const service = new UserService();
    const userUpdated = await service.update(id, data, "responsavel").then();
    console.log(userUpdated);
    return res.status(201).json(userUpdated)
  }
}