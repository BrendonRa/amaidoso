import express, { Router } from 'express';
import { routes } from './routes';

const app = express();
const PORT = "3000";

routes(app)

app.listen(PORT, () => {
    console.log("O site está funcionando em http://localhost:3000");
})