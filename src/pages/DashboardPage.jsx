import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { deleteHouse, getHouses } from '../api.js';
import HouseCard from '../components/HouseCard.jsx';

const TYPE_OPTIONS = ['apartment', 'house', 'villa'];

export default function DashboardPage({ user, onLogout }) {
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
    const [visitedFilter, setVisitedFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [priceSort, setPriceSort] = useState('none');
  const navigate = useNavigate();

  useEffect(() => {
    loadHouses();
  }, [visitedFilter, typeFilter, search]);

  
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
          <h1 className="text-2xl font-semibold">House Inventory</h1><div><a href='/'>Houses</a> | <a href='/users'>Users</a></div>
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
