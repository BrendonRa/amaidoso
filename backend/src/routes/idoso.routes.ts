import { Router } from "express";
import { UserController } from "../controllers/idoso.controller";

const userRoutes = Router();
const controller = new UserController();

// Aqui está todasa as requisições seguidas dos links para fazer as ações do Backend
userRoutes.post("/idoso", controller.register);
userRoutes.get("/idoso", controller.view)
userRoutes.get("/idoso/:id", controller.select);
userRoutes.get("/idoso/login/:cpf/:senha", controller.login)
userRoutes.put("/idoso/update/:id", controller.update)

export default userRoutes;