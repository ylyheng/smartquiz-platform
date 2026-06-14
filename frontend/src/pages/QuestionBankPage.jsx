import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function QuestionBankPage() {
  const navigate = useNavigate();
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '' });
  const [editing, setEditing] = useState(null);

  const load = async () => {
    try {
      const res = await api.get('/banks');
      setBanks(res.data.banks);
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  };

  useEffect(() => { load() }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/banks/${editing}`, form);
      } else {
        await api.post('/banks', form);
      }
      setForm({ title: '', description: '' });
      setEditing(null);
      setShowForm(false);
      load();
    } catch (e) { alert(e.message) }
  };

  const handleEdit = (bank) => {
    setForm({ title: bank.title, description: bank.description || '' });
    setEditing(bank.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this question bank?')) return;
    try {
      await api.delete(`/banks/${id}`);
      load();
    } catch (e) { alert(e.message) }
  };

  if (loading) return <div className="loading-screen">Loading...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Question Banks</h1>
        <button className="btn-primary" onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ title: '', description: '' }) }}>
          {showForm ? 'Cancel' : '+ New Bank'}
        </button>
      </div>

      {showForm && (
        <form className="card form-card" onSubmit={handleSubmit}>
          <h3>{editing ? 'Edit' : 'New'} Question Bank</h3>
          <input placeholder="Bank title" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
          <textarea placeholder="Description (optional)" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} />
          <button type="submit" className="btn-primary">{editing ? 'Update' : 'Create'}</button>
        </form>
      )}

      {banks.length === 0 ? (
        <div className="empty-state">No question banks yet. Create one to get started.</div>
      ) : (
        <div className="card-grid">
          {banks.map(bank => (
            <div key={bank.id} className="card bank-card">
              <div className="bank-info" onClick={() => navigate(`/banks/${bank.id}`)}>
                <h3>{bank.title}</h3>
                {bank.description && <p>{bank.description}</p>}
                <span className="badge">{bank._count.questions} questions</span>
              </div>
              <div className="card-actions">
                <button className="btn-sm" onClick={() => handleEdit(bank)}>Edit</button>
                <button className="btn-sm btn-danger" onClick={() => handleDelete(bank.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
