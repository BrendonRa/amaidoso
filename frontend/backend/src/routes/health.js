const express = require('express');
const { pool } = require('../config/database');

const router = express.Router();

router.get('/', async (_req, res) => {
  const [rows] = await pool.query('SELECT 1 AS ok');

  res.json({
    status: 'ok',
    database: rows[0]?.ok === 1 ? 'connected' : 'unknown',
  });
});

module.exports = router;
