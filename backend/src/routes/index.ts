import express from "express";
import idosoRoutes from "./idoso.routes";
import responsavelRoutes from "./responsavel.routes";

export const routes = (app: express.Express) => {
    app.use(express.json());
    app.use(idosoRoutes);
    app.use(responsavelRoutes);
};
