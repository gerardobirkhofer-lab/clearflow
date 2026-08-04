import { useEffect, useState } from 'react';

interface ReconResult {
  id: string;
  collection_date: string;
  status: string;
  gross_amount: string;
  bank_amount: string | null;
  calculated_fee: string;
  actual_fee_deduction: string | null;
  fee_discrepancy: string | null;
  amount_discrepancy: string | null;
  resolved: boolean;
  checked_at: string;
}

const statusColor: Record<string, string> = {
  MATCHED: '#16a34a',
  CLEARED: '#16a34a',
  UNMATCHED: '#ea580c',
  DISCREPANCY: '#dc2626',
  PENDING: '#ca8a04',
  PARTIAL: '#ca8a04',
};

export default function Reconciliation() {
  const [items, setItems] = useState<ReconResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/v1/reconciliation/results')
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(data => setItems(data.items ?? []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading reconciliation results...</p>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div>
      <h1>Reconciliation Results</h1>
      <p style={{ color: '#64748b' }}>{items.length} total results</p>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 16, background: '#fff', borderRadius: 8, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
        <thead>
          <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
            <th style={{ padding: '12px 16px' }}>Date</th>
            <th style={{ padding: '12px 16px' }}>Status</th>
            <th style={{ padding: '12px 16px' }}>Gross</th>
            <th style={{ padding: '12px 16px' }}>Bank</th>
            <th style={{ padding: '12px 16px' }}>Fee</th>
            <th style={{ padding: '12px 16px' }}>Fee Δ</th>
            <th style={{ padding: '12px 16px' }}>Amount Δ</th>
            <th style={{ padding: '12px 16px' }}>Resolved</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={{ padding: '12px 16px' }}>{item.collection_date}</td>
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
              <td style={{ padding: '12px 16px', fontWeight: 600 }}>€{item.gross_amount}</td>
              <td style={{ padding: '12px 16px' }}>{item.bank_amount ? `€${item.bank_amount}` : '—'}</td>
              <td style={{ padding: '12px 16px' }}>€{item.calculated_fee}</td>
              <td style={{ padding: '12px 16px', color: item.fee_discrepancy && parseFloat(item.fee_discrepancy) > 0 ? '#dc2626' : '#16a34a' }}>
                {item.fee_discrepancy ? `€${item.fee_discrepancy}` : '—'}
              </td>
              <td style={{ padding: '12px 16px', color: item.amount_discrepancy && parseFloat(item.amount_discrepancy) > 0 ? '#dc2626' : '#16a34a' }}>
                {item.amount_discrepancy ? `€${item.amount_discrepancy}` : '—'}
              </td>
              <td style={{ padding: '12px 16px' }}>
                {item.resolved ? '✅' : '❌'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
