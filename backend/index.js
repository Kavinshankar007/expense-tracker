const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const expenseRoutes = require('./routes/expenses');

const app = express();

// Middleware
app.use(cors({
  origin: [
    'https://expense-tracker-inky-nine-62.vercel.app',
    'https://expense-tracker-git-main-kavinshankar007s-projects.vercel.app'
  ],
  credentials: true
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Expense Tracker API is running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});