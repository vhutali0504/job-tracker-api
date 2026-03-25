const express = require('express');
require('dotenv').config();
const pool = require('./config/db');
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ message: 'Server and database are running!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});