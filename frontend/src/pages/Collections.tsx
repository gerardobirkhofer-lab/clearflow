import { useEffect, useState } from 'react';

interface Collection {
  id: string;
  collection_date: string;
  institution_id: string;
  reference: string;
  amount_gross: string;
  card_type: string;
  transaction_count: number;
  status: string;
  created_at: string;
}

const statusColor: Record<string, string> = {
  MATCHED: '#16a34a',
  CLEARED: '#16a34a',
  UNMATCHED: '#ea580c',
  DISCREPANCY: '#dc2626',
  PENDING: '#ca8a04',
  PARTIAL: '#ca8a04',
};

export default function Collections() {
  const [items, setItems] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/v1/collections')
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(data => setItems(data.items ?? []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading collections...</p>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div>
      <h1>Card Collections</h1>
      <p style={{ color: '#64748b' }}>{items.length} total collections</p>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 16, background: '#fff', borderRadius: 8, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
        <thead>
          <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
            <th style={{ padding: '12px 16px' }}>Reference</th>
            <th style={{ padding: '12px 16px' }}>Date</th>
            <th style={{ padding: '12px 16px' }}>Type</th>
            <th style={{ padding: '12px 16px' }}>Transactions</th>
            <th style={{ padding: '12px 16px' }}>Amount</th>
            <th style={{ padding: '12px 16px' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontSize: 13 }}>{item.reference}</td>
              <td style={{ padding: '12px 16px' }}>{item.collection_date}</td>
              <td style={{ padding: '12px 16px', textTransform: 'capitalize' }}>{item.card_type.toLowerCase()}</td>
              <td style={{ padding: '12px 16px' }}>{item.transaction_count}</td>
              <td style={{ padding: '12px 16px', fontWeight: 600 }}>€{item.amount_gross}</td>
              <td style={{ padding: '12px 16px' }}>
                <span style={{
                  padding: '4px 10px',
                  borderRadius: 12,
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#fff',
                  background: statusColor[item.status] || '#64748b',
                  textTransform: 'uppercase',
                }}>{item.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
