import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Houses' },
  { to: '/users', label: 'Users' },
];

export default function AppHeader({ title, subtitle, actions, onLogout }) {
  const linkClass = ({ isActive }) =>
    `rounded-xl px-4 py-2 text-sm ${
      isActive
        ? 'bg-teal-700 text-white shadow-sm'
        : 'border border-teal-200 bg-white/70 text-teal-900 hover:bg-teal-50'
    }`;

  return (
    <header className="border-b border-teal-100 bg-cyan-50/90 px-4 py-4 shadow-sm shadow-teal-900/5 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-teal-950">{title}</h1>
          {subtitle && <p className="text-sm text-teal-700">{subtitle}</p>}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <nav className="flex gap-2">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.to === '/'} className={linkClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>
          {actions}
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="rounded-xl border border-teal-200 bg-white/70 px-4 py-2 text-sm text-teal-900 hover:bg-teal-50"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
