import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUser, deleteHouse, getHouses, getUsers } from '../api.js';
import HouseCard from '../components/HouseCard.jsx';

const TYPE_OPTIONS = ['apartment', 'house', 'villa'];

export default function DashboardPage({ user, onLogout }) {
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userError, setUserError] = useState('');
  const [users, setUsers] = useState([]);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newIsAdmin, setNewIsAdmin] = useState(false);
  const [visitedFilter, setVisitedFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [priceSort, setPriceSort] = useState('none');
  const navigate = useNavigate();

  useEffect(() => {
    loadHouses();
  }, [visitedFilter, typeFilter, search]);

  useEffect(() => {
    if (user?.isAdmin) {
      loadUsers();
    }
  }, [user]);

  const loadHouses = async () => {
    setLoading(true);
    try {
      const query = [];
      if (visitedFilter !== 'all') query.push(`visited=${visitedFilter}`);
      if (typeFilter !== 'all') query.push(`type=${typeFilter}`);
      if (search) query.push(`search=${encodeURIComponent(search)}`);
      const result = await getHouses(query.length ? `?${query.join('&')}` : '');
      setHouses(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const result = await getUsers();
      setUsers(result);
    } catch (err) {
      setUserError(err.message);
    }
  };

  const handleCreateUser = async () => {
    setUserError('');
    if (!newUsername || !newPassword) {
      setUserError('Please enter username and password');
      return;
    }

    try {
      await createUser(newUsername, newPassword, newIsAdmin);
      setNewUsername('');
      setNewPassword('');
      setNewIsAdmin(false);
      loadUsers();
    } catch (err) {
      setUserError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this house?')) return;
    await deleteHouse(id);
    loadHouses();
  };

  const filteredHouses = useMemo(() => {
    let list = [...houses];
    if (priceSort === 'asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (priceSort === 'desc') {
      list.sort((a, b) => b.price - a.price);
    }
    return list;
  }, [houses, priceSort]);

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white px-4 py-4 shadow-sm sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">House Inventory</h1>
          <p className="text-sm text-slate-500">Manage listings with full create, read, update, delete support.</p>
        </div>
      </header>

      <main className="px-4 py-6">
        <section className="mb-6 flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm sm:flex-row sm:items-end sm:justify-between">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-slate-700">Visited</label>
              <select
                value={visitedFilter}
                onChange={(e) => setVisitedFilter(e.target.value)}
                className="mt-2 w-full rounded-xl border-gray-300"
              >
                <option value="all">All</option>
                <option value="true">Visited</option>
                <option value="false">Not visited</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Type</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="mt-2 w-full rounded-xl border-gray-300"
              >
                <option value="all">All</option>
                {TYPE_OPTIONS.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Sort by price</label>
              <select
                value={priceSort}
                onChange={(e) => setPriceSort(e.target.value)}
                className="mt-2 w-full rounded-xl border-gray-300"
              >
                <option value="none">None</option>
                <option value="asc">Low to high</option>
                <option value="desc">High to low</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:w-1/3">
            <label className="block text-sm font-medium text-slate-700">Search</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Title or location"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border-gray-300 px-4 py-3"
              />
              <button
                onClick={loadHouses}
                className="rounded-2xl bg-slate-900 px-4 py-3 text-white hover:bg-slate-700"
              >
                Apply
              </button>
            </div>
          </div>
        </section>

        {user?.isAdmin && (
          <section className="mb-6 rounded-3xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Admin users</h2>
                <p className="text-sm text-slate-500">Create users and manage access for your team.</p>
              </div>
              <div>
                <Link
                  to="/houses/new"
                  className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
                >
                  Add house
                </Link>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-slate-700">Username</label>
                <input
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="mt-2 w-full rounded-xl border-gray-300 px-4 py-3"
                  placeholder="new user"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-2 w-full rounded-xl border-gray-300 px-4 py-3"
                  placeholder="secret"
                />
              </div>
              <div className="flex items-end gap-3">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={newIsAdmin}
                    onChange={(e) => setNewIsAdmin(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-slate-900"
                  />
                  Admin
                </label>
                <button
                  type="button"
                  onClick={handleCreateUser}
                  className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-700"
                >
                  Create user
                </button>
              </div>
            </div>
            {userError && <p className="mt-3 text-sm text-rose-600">{userError}</p>}
            {users.length > 0 && (
              <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="text-sm font-semibold text-slate-700">Current users</h3>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {users.map((u) => (
                    <div key={u.id} className="rounded-2xl bg-white p-3 shadow-sm">
                      <p className="font-semibold">{u.username}</p>
                      <p className="text-sm text-slate-500">{u.isAdmin ? 'Admin' : 'Standard user'}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Listings</h2>
            <p className="text-sm text-slate-500">{filteredHouses.length} houses found</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/houses/new')}
            className="w-full rounded-2xl bg-slate-900 px-5 py-3 text-white hover:bg-slate-700 sm:w-auto"
          >
            Add new house
          </button>
        </div>

        {error && <div className="rounded-2xl bg-rose-100 p-4 text-rose-700">{error}</div>}

        {loading ? (
          <div className="rounded-3xl bg-white p-12 text-center shadow-sm">Loading houses...</div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredHouses.map((house) => (
              <HouseCard key={house.id} house={house} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
