const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const expenseRoutes = require('./routes/expenses');

const app = express();

app.use(cors({
  origin: [
    'https://expense-tracker-inky-nine-62.vercel.app',
    'https://expense-tracker-git-main-kavinshankar007s-projects.vercel.app'
  ],
  credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Expense Tracker API is running!' });
});

// Database test route
app.get('/test-db', async (req, res) => {
  try {
    const pool = require('./db');
    const result = await pool.query('SELECT NOW()');
    res.json({ status: 'DB Connected', time: result.rows[0].now });
  } catch (err) {
    res.json({ status: 'DB Failed', error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})