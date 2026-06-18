import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Houses' },
  { to: '/users', label: 'Users' },
];

export default function AppHeader({ title, subtitle, actions, onLogout }) {
  const linkClass = ({ isActive }) =>
    `rounded-xl px-4 py-2 text-sm ${
      isActive
        ? 'bg-slate-900 text-white'
        : 'border border-slate-200 text-slate-700 hover:bg-slate-100'
    }`;

  return (
    <header className="border-b border-slate-200 bg-white px-4 py-4 shadow-sm">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{title}</h1>
          {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
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
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
