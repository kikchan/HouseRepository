import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setupAdmin } from '../api.js';

export default function SetupPage({ onSetup }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await setupAdmin(username, password);
      onSetup(data.user);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="coast-page flex items-center justify-center px-4">
      <div className="coast-panel w-full max-w-md p-8">
        <h1 className="mb-6 text-2xl font-semibold text-teal-950">Initial Setup</h1>
        <p className="mb-6 text-sm text-teal-700">Create the first admin user to start using the app.</p>
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
          <button
            type="submit"
            disabled={loading}
            className="coast-button-primary w-full rounded-2xl px-4 py-3 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create admin'}
          </button>
        </form>
      </div>
    </div>
  );
}
