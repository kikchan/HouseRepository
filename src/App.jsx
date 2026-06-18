import { Route, Routes } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage.jsx';
import HouseDetailPage from './pages/HouseDetailPage.jsx';
import HouseFormPage from './pages/HouseFormPage.jsx';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/houses/new" element={<HouseFormPage />} />
        <Route path="/houses/:id" element={<HouseDetailPage />} />
        <Route path="/houses/:id/edit" element={<HouseFormPage editMode />} />
        <Route path="*" element={<DashboardPage />} />
      </Routes>
    </div>
  );
}

export default App;
