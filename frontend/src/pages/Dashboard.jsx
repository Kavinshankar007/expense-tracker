import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

const CATEGORIES = [
  { name: 'Food', icon: '🍔', color: 'bg-orange-100 text-orange-600' },
  { name: 'Transport', icon: '🚗', color: 'bg-blue-100 text-blue-600' },
  { name: 'Shopping', icon: '🛍️', color: 'bg-pink-100 text-pink-600' },
  { name: 'Bills', icon: '📄', color: 'bg-yellow-100 text-yellow-600' },
  { name: 'Health', icon: '💊', color: 'bg-green-100 text-green-600' },
  { name: 'Other', icon: '📦', color: 'bg-gray-100 text-gray-600' },
];

const getCategoryMeta = (name) =>
  CATEGORIES.find((c) => c.name === name) || CATEGORIES[5];

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ amount: '', category: 'Food', description: '', date: '' });
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchExpenses = async () => {
    try {
      const res = await API.get('/expenses');
      setExpenses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchExpenses(); }, []);

  const handleAdd = async () => {
    if (!form.amount || !form.date) return setError('Amount and date are required');
    try {
      await API.post('/expenses', form);
      setForm({ amount: '', category: 'Food', description: '', date: '' });
      setError('');
      fetchExpenses();
    } catch (err) {
      setError('Failed to add expense');
    }
  };

  const handleDelete = async (id) => {
    await API.delete(`/expenses/${id}`);
    fetchExpenses();
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const total = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);

  const categoryTotals = CATEGORIES.map((cat) => ({
    ...cat,
    total: expenses
      .filter((e) => e.category === cat.name)
      .reduce((sum, e) => sum + parseFloat(e.amount), 0),
  })).filter((c) => c.total > 0);

  const thisMonth = expenses.filter((e) => {
    const d = new Date(e.date);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const monthTotal = thisMonth.reduce((sum, e) => sum + parseFloat(e.amount), 0);

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-blue-700 to-indigo-800 text-white flex flex-col p-6 fixed h-full">
        <div className="mb-10">
          <h1 className="text-2xl font-bold">💰 SpendSmart</h1>
          <p className="text-blue-200 text-sm mt-1">Personal Finance</p>
        </div>

        <nav className="flex-1 space-y-2">
          {[
            { id: 'dashboard', icon: '📊', label: 'Dashboard' },
            { id: 'add', icon: '➕', label: 'Add Expense' },
            { id: 'history', icon: '📋', label: 'History' },
          ].map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition ${
                activeTab === item.id
                  ? 'bg-white/20 font-semibold'
                  : 'hover:bg-white/10 text-blue-100'
              }`}>
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="border-t border-blue-600 pt-4 mt-4">
          <p className="text-blue-200 text-sm mb-1">Signed in as</p>
          <p className="font-semibold truncate">{user?.name}</p>
          <button onClick={handleLogout}
            className="mt-3 w-full bg-white/10 hover:bg-white/20 py-2 rounded-lg text-sm transition">
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1 p-8">

        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Overview</h2>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-5 mb-8">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl p-6 shadow">
                <p className="text-blue-100 text-sm mb-1">Total Spent</p>
                <p className="text-3xl font-bold">₹{total.toFixed(2)}</p>
                <p className="text-blue-200 text-xs mt-1">{expenses.length} transactions</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow">
                <p className="text-gray-500 text-sm mb-1">This Month</p>
                <p className="text-3xl font-bold text-gray-800">₹{monthTotal.toFixed(2)}</p>
                <p className="text-gray-400 text-xs mt-1">{thisMonth.length} transactions</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow">
                <p className="text-gray-500 text-sm mb-1">Categories Used</p>
                <p className="text-3xl font-bold text-gray-800">{categoryTotals.length}</p>
                <p className="text-gray-400 text-xs mt-1">out of 6 categories</p>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-5">Spending by Category</h3>
              {categoryTotals.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No expenses yet — add some!</p>
              ) : (
                <div className="space-y-4">
                  {categoryTotals.map((cat) => (
                    <div key={cat.name}>
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-lg text-sm ${cat.color}`}>
                            {cat.icon} {cat.name}
                          </span>
                        </div>
                        <span className="font-semibold text-gray-700">₹{cat.total.toFixed(2)}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all"
                          style={{ width: `${Math.min((cat.total / total) * 100, 100)}%` }}>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ADD EXPENSE TAB */}
        {activeTab === 'add' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Expense</h2>
            <div className="bg-white rounded-2xl shadow p-8 max-w-lg">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-5 text-sm">
                  ⚠️ {error}
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                <input className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition"
                  type="number" placeholder="0.00"
                  value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <div className="grid grid-cols-3 gap-2">
                  {CATEGORIES.map((cat) => (
                    <button key={cat.name}
                      onClick={() => setForm({ ...form, category: cat.name })}
                      className={`p-3 rounded-xl border-2 text-sm font-medium transition ${
                        form.category === cat.name
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}>
                      {cat.icon} {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition"
                  type="text" placeholder="What did you spend on?"
                  value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition"
                  type="date"
                  value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </div>

              <button onClick={handleAdd}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition shadow">
                + Add Expense
              </button>
            </div>
          </div>
        )}

        {/* HISTORY TAB */}
        {activeTab === 'history' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Transaction History</h2>
            <div className="bg-white rounded-2xl shadow p-6">
              {expenses.length === 0 ? (
                <p className="text-gray-400 text-center py-12">No transactions yet.</p>
              ) : (
                <div className="space-y-3">
                  {expenses.map((e) => {
                    const meta = getCategoryMeta(e.category);
                    return (
                      <div key={e.id}
                        className="flex justify-between items-center p-4 rounded-xl hover:bg-gray-50 transition border border-gray-100">
                        <div className="flex items-center gap-4">
                          <span className={`text-2xl p-2 rounded-xl ${meta.color}`}>{meta.icon}</span>
                          <div>
                            <p className="font-medium text-gray-800">{e.description || e.category}</p>
                            <p className="text-sm text-gray-400">
                              {e.category} • {new Date(e.date).toLocaleDateString('en-IN', {
                                day: 'numeric', month: 'short', year: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-gray-800 text-lg">₹{parseFloat(e.amount).toFixed(2)}</span>
                          <button onClick={() => handleDelete(e.id)}
                            className="text-gray-300 hover:text-red-500 transition text-xl">✕</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}