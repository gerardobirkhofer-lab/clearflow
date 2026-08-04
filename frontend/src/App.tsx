import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Collections from './pages/Collections';
import Reconciliation from './pages/Reconciliation';
import Institutions from './pages/Institutions';

function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: '12px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: 24, background: '#fff' }}>
        <Link to="/" style={{ textDecoration: 'none', color: '#0f172a', fontWeight: 500 }}>Dashboard</Link>
        <Link to="/collections" style={{ textDecoration: 'none', color: '#0f172a' }}>Collections</Link>
        <Link to="/reconciliation" style={{ textDecoration: 'none', color: '#0f172a' }}>Reconciliation</Link>
        <Link to="/institutions" style={{ textDecoration: 'none', color: '#0f172a' }}>Institutions</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/reconciliation" element={<Reconciliation />} />
        <Route path="/institutions" element={<Institutions />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
