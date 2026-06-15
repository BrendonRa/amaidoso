# Backend Amaidoso

API `Node.js + Express + MySQL` para conectar o app Expo ao banco `amaidoso`.

## 1. Configurar ambiente

Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

Edite o `.env` com os dados reais do seu MySQL:

```env
PORT=5141
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha_aqui
DB_NAME=amaidoso
```

## 2. Instalar dependências

```bash
npm install
```

## 3. Rodar a API

```bash
npm run dev
```

ou

```bash
npm start
```

## 4. Rotas disponíveis

- `GET /health`
- `POST /auth/responsavel/login`
- `POST /auth/responsavel/register`
- `POST /auth/idoso/login`
- `GET /idosos/:id/lembretes`
- `GET /idosos/:id/medicacoes`

## 5. Observações

- O login aceita senha em texto puro e senha com hash `bcrypt` para facilitar a transição do banco atual.
- O frontend usa `EXPO_PUBLIC_API_URL` para apontar para a API.
- Em celular físico, não use `localhost`; use o IP da máquina que está rodando o backend.
