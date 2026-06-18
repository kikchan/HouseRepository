import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { deleteHouse, getHouse, toggleVisited } from '../api.js';

export default function HouseDetailPage() {
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
    if (!window.confirm('Delete this house?')) return;
    await deleteHouse(id);
    navigate('/');
  };

  const handleToggleVisited = async () => {
    await toggleVisited(id, !house.visited);
    loadHouse();
  };

  if (error) {
    return <div className="p-8 text-red-700">{error}</div>;
  }

  if (!house) {
    return <div className="p-8">Loading house...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6">
      <div className="mx-auto max-w-5xl">
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

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-slate-500">Price</p>
                <p className="mt-1 text-xl font-semibold">€{house.price}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Community fee</p>
                <p className="mt-1 text-lg">€{house.communityFee} / month</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">IBI price</p>
                <p className="mt-1 text-lg">€{house.ibiPrice}</p>
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
      </div>
    </div>
  );
}
