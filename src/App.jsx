import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SetupPage from './pages/SetupPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SetupPage />} />
        <Route path="/dashboard/:id" element={<DashboardPage />} />
        <Route path="/view/:shareCode" element={<DashboardPage readOnly />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
