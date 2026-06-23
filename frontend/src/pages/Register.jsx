import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      await API.post('/auth/register', form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-indigo-600 to-purple-700 flex-col justify-center items-center text-white p-12">
        <div className="text-6xl mb-6">🚀</div>
        <h1 className="text-4xl font-bold mb-3">Get Started</h1>
        <p className="text-indigo-100 text-center text-lg leading-relaxed">
          Join thousands who track<br />their expenses smartly.
        </p>
        <div className="mt-10 space-y-4 w-full max-w-xs">
          {['Track daily expenses', 'Categorize spending', 'Analyze your habits'].map((item, i) => (
            <div key={i} className="flex items-center gap-3 bg-white/10 rounded-lg px-4 py-3">
              <span className="text-green-300 font-bold">✓</span>
              <span className="text-indigo-100">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50 p-8">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Create account</h2>
          <p className="text-gray-500 mb-8">Start tracking your expenses today</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
              ⚠️ {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              className="w-full border border-gray-300 p-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white"
              type="text" placeholder="Kavinshankar"
              value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              className="w-full border border-gray-300 p-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white"
              type="email" placeholder="you@example.com"
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              className="w-full border border-gray-300 p-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white"
              type="password" placeholder="Min. 6 characters"
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>

          <button onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition shadow-md">
            Create Account →
          </button>

          <p className="text-center text-sm mt-6 text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}