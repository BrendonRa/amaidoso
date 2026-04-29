const express = require('express');
const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');
const { sendError } = require('../utils/http');

const router = express.Router();
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function checkPassword(inputPassword, storedPassword) {
  if (!storedPassword) {
    return false;
  }

  if (storedPassword.startsWith('$2a$') || storedPassword.startsWith('$2b$') || storedPassword.startsWith('$2y$')) {
    return bcrypt.compare(inputPassword, storedPassword);
  }

  return inputPassword === storedPassword;
}

router.post('/responsavel/login', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return sendError(res, 400, 'Email e senha são obrigatórios.');
  }

  const [rows] = await pool.query(
    `
      SELECT id_responsavel, nome_responsavel, email, senha, foto_perfil
      FROM responsavel
      WHERE LOWER(email) = LOWER(?)
      LIMIT 1
    `,
    [email]
  );

  const responsavel = rows[0];

  if (!responsavel) {
    return sendError(res, 401, 'Credenciais inválidas.');
  }

  const senhaValida = await checkPassword(senha, responsavel.senha);

  if (!senhaValida) {
    return sendError(res, 401, 'Credenciais inválidas.');
  }

  return res.json({
    message: 'Login realizado com sucesso.',
    user: {
      id: responsavel.id_responsavel,
      nome: responsavel.nome_responsavel,
      email: responsavel.email,
      fotoPerfil: responsavel.foto_perfil,
    },
  });
});

router.post('/responsavel/register', async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return sendError(res, 400, 'Nome, email e senha são obrigatórios.');
  }

  const nomeNormalizado = String(nome).trim();
  const emailNormalizado = String(email).trim().toLowerCase();

  if (!nomeNormalizado || !emailNormalizado || !String(senha)) {
    return sendError(res, 400, 'Nome, email e senha são obrigatórios.');
  }

  if (!EMAIL_REGEX.test(emailNormalizado)) {
    return sendError(res, 400, 'Informe um email válido.');
  }

  try {
    const [existingRows] = await pool.query(
      'SELECT id_responsavel FROM responsavel WHERE LOWER(email) = LOWER(?) LIMIT 1',
      [emailNormalizado]
    );

    if (existingRows.length > 0) {
      return sendError(res, 409, 'Já existe um responsável com esse email.');
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const [result] = await pool.query(
      `
        INSERT INTO responsavel (nome_responsavel, email, senha)
        VALUES (?, ?, ?)
      `,
      [nomeNormalizado, emailNormalizado, senhaHash]
    );

    return res.status(201).json({
      message: 'Responsável cadastrado com sucesso.',
      user: {
        id: result.insertId,
        nome: nomeNormalizado,
        email: emailNormalizado,
      },
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return sendError(res, 409, 'Já existe um responsável com esse email.');
    }

    if (error.code === 'ER_CHECK_CONSTRAINT_VIOLATED') {
      return sendError(res, 400, 'Revise os dados informados e tente novamente.');
    }

    throw error;
  }
});

router.post('/idoso/login', async (req, res) => {
  const { cpf, senha } = req.body;

  if (!cpf || !senha) {
    return sendError(res, 400, 'CPF e senha são obrigatórios.');
  }

  const cpfLimpo = String(cpf).replace(/\D/g, '');

  const [rows] = await pool.query(
    `
      SELECT id_idoso, nome_idoso, cpf, senha, foto_perfil, id_responsavel
      FROM idoso
      WHERE cpf = ?
      LIMIT 1
    `,
    [cpfLimpo]
  );

  const idoso = rows[0];

  if (!idoso) {
    return sendError(res, 401, 'Credenciais inválidas.');
  }

  const senhaValida = await checkPassword(senha, idoso.senha);

  if (!senhaValida) {
    return sendError(res, 401, 'Credenciais inválidas.');
  }

  return res.json({
    message: 'Login realizado com sucesso.',
    user: {
      id: idoso.id_idoso,
      nome: idoso.nome_idoso,
      cpf: idoso.cpf,
      fotoPerfil: idoso.foto_perfil,
      responsavelId: idoso.id_responsavel,
    },
  });
});

module.exports = router;
