import { Link } from 'react-router-dom';

export default function HouseCard({ house, onDelete }) {
  return (
    <article className="overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
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
          €{house.price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
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
          <div className="flex flex-wrap gap-2 justify-end">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs uppercase tracking-wide text-slate-600">{house.type}</span>
            <span className="rounded-full px-3 py-1 text-xs text-white uppercase tracking-wide bg-amber-500">{Math.ceil(house.price / house.size)} €/m²</span>
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
          Visited: {house.visitedDate ? new Date(house.visitedDate).toLocaleString("es-ES", { hour12: false }) : 'Not visited'}
        </div>
        <div className="mb-4 text-xs text-slate-500">
          Modified: {new Date(house.modified||house.updatedAt).toLocaleString("es-ES", { hour12: false })}
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to={`/houses/${house.id}`}
            className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
          >
            View
          </Link>
          <Link to={`/houses/${house.id}/edit`} className="rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-900 hover:bg-slate-100">
            Edit
          </Link>
          <button
            type="button"
            onClick={() => onDelete(house.id)}
            className="rounded-2xl border border-rose-200 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
