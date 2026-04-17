import { Router } from "express";
import { UserController } from "../controllers/idoso.controller";

const userRoutes = Router();
const controller = new UserController();

// Aqui está todasa as requisições seguidas dos links para fazer as ações do Backend
userRoutes.post("/idoso", controller.create);
userRoutes.get("/idoso", controller.view)
userRoutes.get("/idoso/:id", controller.select);

export default userRoutes;