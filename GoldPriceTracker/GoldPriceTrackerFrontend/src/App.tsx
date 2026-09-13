import { Route, Routes } from 'react-router';
import HomePage from './pages/HomePage';
import HistoryPage from './pages/HistoryPage';
import AlertsPage from './pages/AlertsPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/history" element={<HistoryPage />} />
      <Route path="/alerts" element={<AlertsPage />} />
    </Routes>
  );
}

export default App;