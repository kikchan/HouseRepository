import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage.jsx';
import HouseDetailPage from './pages/HouseDetailPage.jsx';
import HouseFormPage from './pages/HouseFormPage.jsx';
import UsersPage from './pages/UsersPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SetupPage from './pages/SetupPage.jsx';
import { fetchJson } from './api.js';

function ProtectedRoute({ user, children }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [firstRun, setFirstRun] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function init() {
      try {
        const initial = await fetchJson('/auth/first-run');
        if (initial.firstRun) {
          setFirstRun(true);
          setLoading(false);
          return;
        }

        const data = await fetchJson('/auth/me');
        setUser(data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    init();
  }, []);

  const handleLogout = async () => {
    await fetchJson('/auth/logout', { method: 'POST' });
    setUser(null);
    navigate('/login');
  };

  const handleSetup = (newUser) => {
    setUser(newUser);
    setFirstRun(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-700">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Routes>
        <Route
          path="/setup"
          element={
            firstRun ? (
              <SetupPage onSetup={handleSetup} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/login"
          element={
            firstRun ? (
              <Navigate to="/setup" replace />
            ) : (
              <LoginPage user={user} onLogin={setUser} />
            )
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute user={user}>
              <DashboardPage user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route path="/users" element={<ProtectedRoute user={user}><UsersPage user={user} /></ProtectedRoute>} />
        <Route
          path="/houses/new"
          element={
            <ProtectedRoute user={user}>
              <HouseFormPage user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/houses/:id"
          element={
            <ProtectedRoute user={user}>
              <HouseDetailPage user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/houses/:id/edit"
          element={
            <ProtectedRoute user={user}>
              <HouseFormPage editMode user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={<Navigate to={firstRun ? '/setup' : user ? '/' : '/login'} replace />}
        />
      </Routes>
    </div>
  );
}

export default App;
