import { useEffect, useMemo, useState } from 'react';
import { createUser, getUsers } from '../api.js';
import AppHeader from '../components/AppHeader.jsx';

export default function UsersPage({ user, onLogout }) {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const sortedUsers = useMemo(
    () => [...users].sort((a, b) => a.username.localeCompare(b.username)),
    [users]
  );

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await getUsers();
      setUsers(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    setError('');
    setSaving(true);

    try {
      await createUser(username.trim(), password, false);
      setUsername('');
      setPassword('');
      await loadUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="coast-page">
      <AppHeader
        title="Users"
        onLogout={onLogout}
      />

      <main className="mx-auto max-w-6xl px-4 py-6">
        {error && (
          <div className="mb-6 rounded-2xl bg-rose-100 p-4 text-sm text-rose-700">
            {error}
          </div>
        )}

        {user?.isAdmin && (
          <section className="coast-panel mb-6 p-6">
            <div className="mb-5">
              <h2 className="text-lg font-semibold">Create User</h2>
              <p className="text-sm text-slate-500">New users are created as non-admin accounts.</p>
            </div>

            <form className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end" onSubmit={handleCreate}>
              <div>
                <label className="block text-sm font-medium text-slate-700">Username</label>
                <input
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  className="coast-field mt-2 w-full rounded-xl px-4 py-3"
                  placeholder="Username"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="coast-field mt-2 w-full rounded-xl px-4 py-3"
                  placeholder="Password"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="coast-button-primary rounded-2xl px-5 py-3 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? 'Creating...' : 'Create'}
              </button>
            </form>
          </section>
        )}

        <section className="coast-panel overflow-hidden">
          <div className="border-b border-teal-100 p-6">
            <h2 className="text-lg font-semibold">Current Users</h2>
            <p className="text-sm text-slate-500">{sortedUsers.length} accounts found</p>
          </div>

          {loading ? (
            <div className="p-10 text-center text-slate-500">Loading users...</div>
          ) : sortedUsers.length === 0 ? (
            <div className="p-10 text-center text-slate-500">No users found.</div>
          ) : (
            <div className="divide-y divide-teal-100">
              {sortedUsers.map((account) => (
                <div key={account.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-50 text-sm font-semibold uppercase text-teal-800">
                      {account.username.slice(0, 2)}
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">{account.username}</div>
                      <div className="text-sm text-slate-500">User ID: {account.id}</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {account.isAdmin && (
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                        Admin
                      </span>
                    )}
                    {account.id === user?.id && (
                      <span className="rounded-full bg-teal-700 px-3 py-1 text-xs font-medium text-white">
                        You
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
