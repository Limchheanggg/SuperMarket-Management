import { useState, useEffect } from 'react';
import API from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminMembership() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState('All');

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await API.get('/api/membership/');
      setMembers(res.data || []);
      console.log("Loaded members count:", res.data?.length);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMembers(); }, []);

  const filtered = members.filter(m => {
    const term = search.toLowerCase().trim();
    const name = (m.full_name || '').toLowerCase();
    const matchSearch = !term || name.includes(term);
    const matchTier = tierFilter === 'All' || (m.tier || m.Tier) === tierFilter;
    return matchSearch && matchTier;
  });

  return (
    <div style={{ padding: '30px' }}>
      <h1>Customer Membership</h1>

      <div style={{ margin: '20px 0', display: 'flex', gap: '10px' }}>
        <input 
          value={search} 
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name..." 
          style={{ padding: '12px', width: '400px', borderRadius: '8px' }}
        />
        <button onClick={fetchMembers} style={{ padding: '12px 20px', background: '#15803d', color: 'white', border: 'none', borderRadius: '8px' }}>
          Refresh
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        {['All','Bronze','Silver','Gold','Platinum'].map(t => (
          <button key={t} onClick={() => setTierFilter(t)}
            style={{ marginRight: '8px', padding: '8px 16px', borderRadius: '8px', background: tierFilter === t ? '#15803d' : '#eee', color: tierFilter === t ? 'white' : 'black' }}>
            {t}
          </button>
        ))}
      </div>

      {loading ? <p>Loading...</p> : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f0f0f0' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>Customer</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Tier</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Points</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(m => (
              <tr key={m.Customer_ID} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '12px' }}>{m.full_name}</td>
                <td style={{ padding: '12px' }}>{m.tier || m.Tier}</td>
                <td style={{ padding: '12px' }}>{m.points || m.Points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
