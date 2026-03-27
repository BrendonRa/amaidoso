import { Request, Response } from "express";
import { UserService } from "../services/user.service";

export class UserController {
  async create(req: Request, res: Response) {
    const service = new UserService();
    const user = await service.create(req.body);
    return res.json(user);
  }
  async view(req: Request, res: Response) {
    const service = new UserService();
    const allUsers = await service.view()
    return res.json(allUsers);
  }
}