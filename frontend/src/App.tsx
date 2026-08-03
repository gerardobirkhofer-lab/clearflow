import { useEffect, useState } from 'react';

interface MorningReport {
  report_date: string;
  total_collections: number;
  matched_count: number;
  unmatched_count: number;
  discrepancy_count: number;
  actual_bank_balance: string | null;
  projected_incoming_7d: string | null;
  projected_incoming_30d: string | null;
  total_fees_yesterday: string | null;
  alerts: Array<{ severity: string; message: string; category: string }> | null;
  uncleared_by_institution: Array<{ name: string; uncleared_count: number; uncleared_amount: string }> | null;
  recent_discrepancies: Array<{ reference: string; institution_name: string; expected_amount: string; difference: string }> | null;
}

function App() {
  const [report, setReport] = useState<MorningReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/v1/morning-reports/latest')
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(data => setReport(data))
      .catch(err => setError(err.message));
  }, []);

  if (error) return <div style={{ padding: 40, fontFamily: 'sans-serif', color: 'red' }}>Error: {error}</div>;
  if (!report) return <div style={{ padding: 40, fontFamily: 'sans-serif' }}><h1>ClearFlow</h1><p>Loading report...</p></div>;

  const alerts = report.alerts ?? [];
  const uncleared = report.uncleared_by_institution ?? [];
  const discrepancies = report.recent_discrepancies ?? [];

  const severityColor = (s: string) => {
    if (s === 'CRITICAL') return '#dc2626';
    if (s === 'WARNING') return '#ea580c';
    return '#16a34a';
  };

  return (
    <div style={{ padding: 40, fontFamily: 'sans-serif', maxWidth: 1200, margin: '0 auto' }}>
      <h1>ClearFlow — Morning Report</h1>
      <p style={{ color: '#666' }}>Date: {report.report_date}</p>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, margin: '24px 0' }}>
        {[
          { label: 'Collections', value: report.total_collections },
          { label: 'Matched', value: report.matched_count, color: '#16a34a' },
          { label: 'Unmatched', value: report.unmatched_count, color: '#ea580c' },
          { label: 'Discrepancies', value: report.discrepancy_count, color: '#dc2626' },
          { label: 'Bank Balance', value: `€${report.actual_bank_balance ?? '—'}` },
          { label: '7d Projection', value: `€${report.projected_incoming_7d ?? '—'}` },
        ].map(kpi => (
          <div key={kpi.label} style={{ padding: 20, borderRadius: 8, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase' }}>{kpi.label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: kpi.color || '#0f172a', marginTop: 4 }}>{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* Alerts */}
      <h2>Alerts</h2>
      {alerts.length === 0 ? <p style={{ color: '#64748b' }}>No alerts.</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {alerts.map((a, i) => (
            <div key={i} style={{ padding: 12, borderRadius: 6, background: severityColor(a.severity) + '10', borderLeft: `4px solid ${severityColor(a.severity)}` }}>
              <strong style={{ color: severityColor(a.severity) }}>[{a.severity}]</strong> {a.message}
            </div>
          ))}
        </div>
      )}

      {/* Uncleared by Institution */}
      <h2 style={{ marginTop: 32 }}>Uncleared by Institution</h2>
      {uncleared.length === 0 ? <p style={{ color: '#64748b' }}>All clear.</p> : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
              <th style={{ padding: '8px 12px' }}>Institution</th>
              <th style={{ padding: '8px 12px' }}>Count</th>
              <th style={{ padding: '8px 12px' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {uncleared.map((inst, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '8px 12px' }}>{inst.name}</td>
                <td style={{ padding: '8px 12px' }}>{inst.uncleared_count}</td>
                <td style={{ padding: '8px 12px' }}>€{inst.uncleared_amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Recent Discrepancies */}
      <h2 style={{ marginTop: 32 }}>Recent Discrepancies</h2>
      {discrepancies.length === 0 ? <p style={{ color: '#64748b' }}>No discrepancies.</p> : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
              <th style={{ padding: '8px 12px' }}>Reference</th>
              <th style={{ padding: '8px 12px' }}>Institution</th>
              <th style={{ padding: '8px 12px' }}>Expected</th>
              <th style={{ padding: '8px 12px' }}>Difference</th>
            </tr>
          </thead>
          <tbody>
            {discrepancies.map((d, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '8px 12px' }}>{d.reference}</td>
                <td style={{ padding: '8px 12px' }}>{d.institution_name}</td>
                <td style={{ padding: '8px 12px' }}>€{d.expected_amount}</td>
                <td style={{ padding: '8px 12px', color: '#dc2626' }}>€{d.difference}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
