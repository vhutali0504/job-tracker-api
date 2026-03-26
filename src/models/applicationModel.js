const pool = require('../config/db');

const getAllApplications = async (userId) => {
  const result = await pool.query(
    'SELECT * FROM applications WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  return result.rows;
};

const createApplication = async (userId, company, role, status, date_applied, notes) => {
  const result = await pool.query(
    `INSERT INTO applications (user_id, company, role, status, date_applied, notes)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [userId, company, role, status, date_applied, notes]
  );
  return result.rows[0];
};

const updateApplication = async (id, userId, fields) => {
  const { company, role, status, date_applied, notes } = fields;
  const result = await pool.query(
    `UPDATE applications
     SET company = $1, role = $2, status = $3, date_applied = $4, notes = $5
     WHERE id = $6 AND user_id = $7
     RETURNING *`,
    [company, role, status, date_applied, notes, id, userId]
  );
  return result.rows[0];
};


const deleteApplication = async (id, userId) => {
  const result = await pool.query(
    'DELETE FROM applications WHERE id = $1 AND user_id = $2 RETURNING *',
    [id, userId]
  );
  return result.rows[0];
};

const getSummary = async (userId) => {
  const result = await pool.query(
    `SELECT status, COUNT(*) as count
     FROM applications
     WHERE user_id = $1
     GROUP BY status`,
    [userId]
  );
  return result.rows;
};


module.exports = { getAllApplications, createApplication, updateApplication, deleteApplication, getSummary }