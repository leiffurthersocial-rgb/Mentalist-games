// Router + layout composition. HashRouter is used so the app works on GitHub
// Pages (and any static host) without server-side rewrite rules.

import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppStateProvider } from './context/AppState';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import DailyRoutine from './pages/DailyRoutine';
import Settings from './pages/Settings';
import ModulePage from './pages/ModulePage';

export default function App() {
  return (
    <AppStateProvider>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/daily" element={<DailyRoutine />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/m/:moduleId" element={<ModulePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </HashRouter>
    </AppStateProvider>
  );
}
