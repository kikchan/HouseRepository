import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { deleteHouse, getHouse, toggleVisited } from '../api.js';
import AppHeader from '../components/AppHeader.jsx';

export default function HouseDetailPage({ onLogout }) {
  const { id } = useParams();
  const [house, setHouse] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadHouse();
  }, [id]);

  const loadHouse = async () => {
    try {
      const data = await getHouse(id);
      setHouse(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${house.title}"? This cannot be undone.`)) return;
    await deleteHouse(id);
    navigate('/');
  };

  const handleToggleVisited = async () => {
    await toggleVisited(id, !house.visited);
    loadHouse();
  };

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <AppHeader title="House Inventory" subtitle="Unable to load house details." onLogout={onLogout} />
        <main className="mx-auto max-w-6xl px-4 py-6">
          <div className="rounded-2xl bg-rose-100 p-4 text-rose-700">{error}</div>
        </main>
      </div>
    );
  }

  if (!house) {
    return (
      <div className="min-h-screen bg-slate-50">
        <AppHeader title="House Inventory" subtitle="Loading house details..." onLogout={onLogout} />
        <main className="mx-auto max-w-6xl px-4 py-6">
          <div className="rounded-3xl bg-white p-12 text-center shadow-sm">Loading house...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader
        title="House Inventory"
        subtitle="View listing details, notes, and visit status."
        onLogout={onLogout}
      />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <button
          type="button"
          onClick={() => navigate('/')}
          aria-label="Back to houses"
          className="mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-xl leading-none text-slate-700 shadow-sm hover:bg-slate-100"
        >
          &larr;
        </button>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">{house.title}</h1>
            <p className="text-sm text-slate-500">{house.location}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to={`/houses/${id}/edit`}
              className="rounded-2xl bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-700"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="rounded-2xl bg-amber-500 px-4 py-2 text-sm text-slate-900 hover:bg-amber-400"
            >
              Delete
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
          <img
            src={house.imagePath}
            alt={house.title}
            className="h-96 w-full object-cover"
            onError={(e) => {
              e.target.src = '/placeholder.png';
            }}
          />
          <div className="p-6">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">{house.type}</span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">{house.rooms} rooms</span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">{house.bathrooms} bathrooms</span>
              <span className={`rounded-full px-3 py-1 text-sm ${house.visited ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                {house.visited ? 'Visited' : 'Not visited'}
              </span>
            </div>
            <div className="mb-4 grid gap-3 sm:grid-cols-1 text-sm text-slate-500">
              <div>Added: {new Date(house.added||house.added).toLocaleString("es-ES", { hour12: false })}</div>
              <div>Modified: {new Date(house.modified||house.updatedAt).toLocaleString("es-ES", { hour12: false })}</div>
              <div>Visited Date: {house.visitedDate? new Date(house.visitedDate).toLocaleString("es-ES", { hour12: false }):'N/A'}</div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-slate-500">Price</p>
                <p className="mt-1 text-xl font-semibold">{house.price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Community fee</p>
                <p className="mt-1 text-lg">{house.communityFee.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })} / month</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">IBI price</p>
                <p className="mt-1 text-lg">{house.ibiPrice.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Link</p>
                <a href={house.link || '#'} target="_blank" rel="noreferrer" className="mt-1 block text-slate-900 underline">
                  {house.link ? 'Open listing' : 'No link provided'}
                </a>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <h2 className="text-lg font-semibold">Description</h2>
                <p className="mt-2 text-slate-600">{house.description || 'No description available.'}</p>
              </div>
              <div>
                <h2 className="text-lg font-semibold">Pros</h2>
                <p className="mt-2 text-slate-600">{house.pros || 'No pros listed.'}</p>
              </div>
              <div>
                <h2 className="text-lg font-semibold">Cons</h2>
                <p className="mt-2 text-slate-600">{house.cons || 'No cons listed.'}</p>
              </div>
              {(house.agentName || house.agentPhone) && (
                <div>
                  <h2 className="text-lg font-semibold">Agent Information</h2>
                  <div className="mt-2 space-y-1 text-slate-600">
                    {house.agentName && <p><strong>Name:</strong> {house.agentName}</p>}
                    {house.agentPhone && <p><strong>Phone:</strong> {house.agentPhone}</p>}
                  </div>
                </div>
              )}
              <div>
                <button
                  onClick={handleToggleVisited}
                  className="rounded-2xl bg-slate-900 px-5 py-3 text-white hover:bg-slate-700"
                >
                  Mark as {house.visited ? 'not visited' : 'visited'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
