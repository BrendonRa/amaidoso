const express = require('express');
const { pool } = require('../config/database');
const { sendError } = require('../utils/http');

const router = express.Router();

router.get('/:id/lembretes', async (req, res) => {
  const idIdoso = Number(req.params.id);

  if (!Number.isInteger(idIdoso) || idIdoso <= 0) {
    return sendError(res, 400, 'Id do idoso inválido.');
  }

  const [rows] = await pool.query(
    `
      SELECT id_lembrete, titulo, descricao, data_hora, endereco
      FROM lembrete
      WHERE id_idoso = ?
      ORDER BY data_hora ASC
    `,
    [idIdoso]
  );

  return res.json(rows);
});

router.get('/:id/medicacoes', async (req, res) => {
  const idIdoso = Number(req.params.id);

  if (!Number.isInteger(idIdoso) || idIdoso <= 0) {
    return sendError(res, 400, 'Id do idoso inválido.');
  }

  const [rows] = await pool.query(
    `
      SELECT
        id_medicacao,
        nome_medicamento,
        valor_dose,
        unidade_medida,
        intervalo_dias,
        data_inicio,
        hora_alarme,
        continuo,
        status_tomado
      FROM medicacao
      WHERE id_idoso = ?
      ORDER BY hora_alarme ASC
    `,
    [idIdoso]
  );

  return res.json(rows);
});

module.exports = router;
