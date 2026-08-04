import { useEffect, useState } from 'react';

interface Institution {
  id: string;
  name: string;
  country: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SYNCING' | 'ERROR';
  last_sync: string | null;
  account_count: number;
}

export default function Institutions() {
  const [items, setItems] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/institutions')
      .then(r => r.json())
      .then(data => {
        setItems(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ padding: 24 }}>Loading institutions…</div>;
  if (error) return <div style={{ padding: 24, color: '#dc2626' }}>Error: {error}</div>;

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ margin: 0 }}>Institutions</h1>
      <p style={{ color: '#64748b', margin: '4px 0 0 0' }}>{items.length} connected banks</p>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 24 }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left', fontSize: 14, color: '#475569' }}>
            <th style={{ padding: 12 }}>Name</th>
            <th style={{ padding: 12 }}>Country</th>
            <th style={{ padding: 12 }}>Status</th>
            <th style={{ padding: 12 }}>Accounts</th>
            <th style={{ padding: 12 }}>Last Sync</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={{ padding: 12, fontWeight: 500 }}>{item.name}</td>
              <td style={{ padding: 12 }}>{item.country}</td>
              <td style={{ padding: 12 }}>
                <StatusBadge status={item.status} />
              </td>
              <td style={{ padding: 12 }}>{item.account_count}</td>
              <td style={{ padding: 12, color: '#64748b', fontSize: 13 }}>
                {item.last_sync ? new Date(item.last_sync).toLocaleString() : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    ACTIVE: { bg: '#dcfce7', text: '#166534' },
    INACTIVE: { bg: '#f3f4f6', text: '#374151' },
    SYNCING: { bg: '#dbeafe', text: '#1e40af' },
    ERROR: { bg: '#fee2e2', text: '#991b1b' },
  };
  const c = colors[status] || { bg: '#f3f4f6', text: '#374151' };
  return (
    <span style={{
      display: 'inline-block',
      padding: '4px 10px',
      borderRadius: 4,
      fontSize: 12,
      fontWeight: 600,
      textTransform: 'uppercase',
      backgroundColor: c.bg,
      color: c.text,
    }}>
      {status}
    </span>
  );
}
