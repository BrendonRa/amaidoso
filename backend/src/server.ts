import express, { Router } from 'express';
import { routes } from './routes';
import cors from 'cors';

const app = express();
const PORT = "3000";

app.use(cors());
routes(app)

app.listen(PORT, () => {
    console.log("O site está funcionando em http://localhost:3000");
})