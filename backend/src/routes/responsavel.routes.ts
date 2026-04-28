import { Router } from "express";
import { UserController } from "../controllers/responsavel.controller";

const userRoutes = Router();
const controller = new UserController();

// Aqui está todasa as requisições seguidas dos links para fazer as ações do Backend
userRoutes.post("/responsavel", controller.register);
userRoutes.get("/responsavel", controller.view)
userRoutes.get("/responsavel/:id", controller.select)
userRoutes.get("/responsavel/login/:email/:senha", controller.login)
userRoutes.put("/responsavel/update/:id", controller.update)

export default userRoutes;