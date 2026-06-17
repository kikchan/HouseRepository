import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { login } from '../api.js';

export default function LoginPage({ user, onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const data = await login(username, password);
      onLogin(data.user);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-lg">
        <h1 className="text-2xl font-semibold mb-6">House Inventory Login</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-slate-700">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-2 w-full rounded-xl border-gray-300 shadow-sm"
              placeholder="admin"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-xl border-gray-300 shadow-sm"
              placeholder="password123"
            />
          </div>
          {error && <div className="text-sm text-red-600">{error}</div>}
          <button className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-white hover:bg-slate-700">
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
