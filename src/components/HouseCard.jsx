import { Link, useNavigate } from 'react-router-dom';

export default function HouseCard({ house, onDelete }) {
  const navigate = useNavigate();
  const detailPath = `/houses/${house.id}`;
  const pricePerSquareMeter = house.size > 0 ? Math.ceil(house.price / house.size) : null;

  const openHouse = () => {
    navigate(detailPath);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openHouse();
    }
  };

  const stopCardClick = (event) => {
    event.stopPropagation();
  };

  const stopCardKeyDown = (event) => {
    event.stopPropagation();
  };

  return (
    <article
      role="link"
      tabIndex={0}
      onClick={openHouse}
      onKeyDown={handleKeyDown}
      className="cursor-pointer overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
    >
      <div className="relative h-56">
        <img
          src={house.imagePath}
          alt={house.title}
          className="h-full w-full object-cover"
          onError={(event) => {
            event.target.src = '/placeholder.png';
          }}
        />
        <div className="absolute left-4 top-4 rounded-full bg-slate-900 px-3 py-1 text-sm text-white">
          {house.price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
        </div>
        <div className={`absolute right-4 top-4 rounded-full px-3 py-1 text-sm text-white ${
          house.visited ? 'bg-emerald-500' : 'bg-amber-500'
        }`}>
          {house.visited ? 'Visited' : 'Not visited'}
        </div>
      </div>
      <div className="p-5">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-semibold">{house.title}</h2>
            <p className="text-sm text-slate-500">{house.location}</p>
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs uppercase tracking-wide text-slate-600">
              {house.type}
            </span>
            {pricePerSquareMeter && (
              <span className="rounded-full bg-amber-500 px-3 py-1 text-xs uppercase tracking-wide text-white">
                {pricePerSquareMeter.toLocaleString('es-ES')} EUR/m2
              </span>
            )}
          </div>
        </div>
        <div className="mb-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
          <span>{house.rooms} rooms</span>
          <span>{house.bathrooms} baths</span>
        </div>
        <div className="mb-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
          <span>IBI {house.ibiPrice.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span>
          <span>Community fee {house.communityFee.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })} / month</span>
        </div>
        <div className="mb-4 text-xs text-slate-500">
          Visited: {house.visitedDate ? new Date(house.visitedDate).toLocaleString('es-ES', { hour12: false }) : 'Not visited'}
        </div>
        <div className="mb-4 text-xs text-slate-500">
          Modified: {new Date(house.modified || house.updatedAt).toLocaleString('es-ES', { hour12: false })}
        </div>
        <div className="flex flex-wrap gap-3" onClick={stopCardClick} onKeyDown={stopCardKeyDown}>
          <Link
            to={detailPath}
            className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
          >
            View
          </Link>
          <Link
            to={`/houses/${house.id}/edit`}
            className="rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-900 hover:bg-slate-100"
          >
            Edit
          </Link>
          <button
            type="button"
            onClick={() => onDelete(house)}
            className="rounded-2xl border border-rose-200 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
