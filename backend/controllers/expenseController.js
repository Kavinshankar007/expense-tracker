const pool = require('../db');

const getExpenses = async (req, res) => {
  try {
    const expenses = await pool.query(
      'SELECT * FROM expenses WHERE user_id = $1 ORDER BY date DESC',
      [req.user.id]
    );
    res.json(expenses.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const addExpense = async (req, res) => {
  const { amount, category, description, date } = req.body;
  try {
    const newExpense = await pool.query(
      'INSERT INTO expenses (user_id, amount, category, description, date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [req.user.id, amount, category, description, date]
    );
    res.status(201).json(newExpense.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const deleteExpense = async (req, res) => {
  try {
    await pool.query('DELETE FROM expenses WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getExpenses, addExpense, deleteExpense };