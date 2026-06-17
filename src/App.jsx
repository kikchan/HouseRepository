import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import HouseDetailPage from './pages/HouseDetailPage.jsx';
import HouseFormPage from './pages/HouseFormPage.jsx';
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
  const navigate = useNavigate();

  useEffect(() => {
    async function loadUser() {
      try {
        const data = await fetchJson('/auth/me', { credentials: 'include' });
        setUser(data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  const handleLogout = async () => {
    await fetchJson('/auth/logout', { method: 'POST', credentials: 'include' });
    setUser(null);
    navigate('/login');
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
        <Route path="/login" element={<LoginPage user={user} onLogin={setUser} />} />
        <Route
          path="/"
          element={
            <ProtectedRoute user={user}>
              <DashboardPage user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
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
        <Route path="*" element={<Navigate to={user ? '/' : '/login'} replace />} />
      </Routes>
    </div>
  );
}

export default App;
