import { Router } from "express";
import { UserController } from "../controllers/user.controller";

const userRoutes = Router();
const controller = new UserController();

// Aqui está todasa as requisições seguidas dos links para fazer as ações do Backend
userRoutes.post("/", controller.create);
userRoutes.get("/", controller.view)
userRoutes.get("/:id", controller.select)

export default userRoutes;