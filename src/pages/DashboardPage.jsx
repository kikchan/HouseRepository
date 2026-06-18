import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteHouse, getHouses } from '../api.js';
import AppHeader from '../components/AppHeader.jsx';
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
  const fieldClass = 'mt-2 h-11 w-full rounded-xl border-gray-300 px-3 text-sm shadow-sm';
  const buttonClass = 'h-11 rounded-xl px-4 text-sm font-medium transition';

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

  const handleDelete = async (house) => {
    if (!window.confirm(`Delete "${house.title}"? This cannot be undone.`)) return;
    await deleteHouse(house.id);
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
      <AppHeader
        title="House Inventory"
        onLogout={onLogout}
      />

      <main className="mx-auto max-w-6xl px-4 py-6">
        <section className="mb-6 rounded-3xl bg-white p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_minmax(18rem,1.4fr)] lg:items-end">
            <div className="min-w-0">
              <label className="block text-sm font-medium text-slate-700">Visited</label>
              <select
                value={visitedFilter}
                onChange={(e) => setVisitedFilter(e.target.value)}
                className={fieldClass}
              >
                <option value="all">All</option>
                <option value="true">Visited</option>
                <option value="false">Not visited</option>
              </select>
            </div>
            <div className="min-w-0">
              <label className="block text-sm font-medium text-slate-700">Type</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className={fieldClass}
              >
                <option value="all">All</option>
                {TYPE_OPTIONS.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="min-w-0">
              <label className="block text-sm font-medium text-slate-700">Sort by price</label>
              <select
                value={priceSort}
                onChange={(e) => setPriceSort(e.target.value)}
                className={fieldClass}
              >
                <option value="none">None</option>
                <option value="asc">Low to high</option>
                <option value="desc">High to low</option>
              </select>
            </div>

            <div className="min-w-0">
              <label className="block text-sm font-medium text-slate-700">Search</label>
              <div className="mt-2 grid grid-cols-[minmax(0,1fr)_auto_auto] gap-2">
                <input
                  type="text"
                  placeholder="Title or location"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-11 min-w-0 rounded-xl border-gray-300 px-3 text-sm shadow-sm"
                />
                <button
                  type="button"
                  onClick={loadHouses}
                  className={`${buttonClass} bg-slate-900 text-white hover:bg-slate-700`}
                >
                  Apply
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/houses/new')}
                  className={`${buttonClass} border border-slate-200 bg-white text-slate-900 hover:bg-slate-100`}
                >
                  Add house
                </button>
              </div>
            </div>
          </div>
        </section>

        

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Listings</h2>
            <p className="text-sm text-slate-500">{filteredHouses.length} houses found</p>
          </div>
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
