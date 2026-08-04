import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Collections from './pages/Collections';
import Reconciliation from './pages/Reconciliation';

function App() {
  const navStyle = ({ isActive }: { isActive: boolean }) => ({
    padding: '12px 20px',
    textDecoration: 'none',
    color: isActive ? '#0f172a' : '#64748b',
    borderBottom: isActive ? '2px solid #0f172a' : '2px solid transparent',
    fontWeight: isActive ? 600 : 400,
  });

  return (
    <BrowserRouter>
      <div style={{ fontFamily: 'sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
        <nav style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '0 40px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ fontSize: 20, fontWeight: 700, marginRight: 24, color: '#0f172a' }}>ClearFlow</div>
          <NavLink to="/" style={navStyle} end>Dashboard</NavLink>
          <NavLink to="/collections" style={navStyle}>Collections</NavLink>
          <NavLink to="/reconciliation" style={navStyle}>Reconciliation</NavLink>
        </nav>
        <main style={{ padding: 40, maxWidth: 1200, margin: '0 auto' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/reconciliation" element={<Reconciliation />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
