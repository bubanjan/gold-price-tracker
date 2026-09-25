import { Route, Routes } from 'react-router';
import {
  createTheme,
  CssBaseline,
  ThemeProvider
} from '@mui/material';

import HomePage from './pages/HomePage';
import HistoryPage from './pages/HistoryPage';
import NotificationsPage from './pages/NotificationsPage';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90ee90',
    },
    background: {
      default: '#000000',
      paper: '#111111',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;