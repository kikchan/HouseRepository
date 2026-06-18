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
    <div className="coast-page flex items-center justify-center px-4">
      <div className="coast-panel w-full max-w-md p-8">
        <h1 className="mb-6 text-2xl font-semibold text-teal-950">House Inventory Login</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-slate-700">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="coast-field mt-2 w-full rounded-xl px-4 py-3"
              placeholder="admin"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="coast-field mt-2 w-full rounded-xl px-4 py-3"
              placeholder="password123"
            />
          </div>
          {error && <div className="text-sm text-red-600">{error}</div>}
          <button className="coast-button-primary w-full rounded-2xl px-4 py-3">
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
