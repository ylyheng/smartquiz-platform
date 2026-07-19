import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Plus, Search, Layers3, ListChecks, Trash2, Pencil } from 'lucide-react';
import LecturerShell from '../components/layout/LecturerShell';
import api from '../services/api';

export default function QuestionBankPage() {
  const navigate = useNavigate();
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingBank, setEditingBank] = useState(null);
  const [form, setForm] = useState({ title: '', description: '' });

  const loadBanks = async () => {
    try {
      setLoading(true);
      const res = await api.get('/banks');
      setBanks(res.data.banks || []);
    } catch (e) {
      console.error(e);
      setBanks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadBanks(); }, []);

  const filteredBanks = banks.filter(b =>
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (b.description && b.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalQuestions = banks.reduce((sum, b) => sum + (b._count?.questions || 0), 0);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    try {
      await api.post('/banks', form);
      setForm({ title: '', description: '' });
      setShowCreateForm(false);
      loadBanks();
    } catch (e) { alert(e.message); }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !editingBank) return;
    try {
      await api.put(`/banks/${editingBank.id}`, form);
      setForm({ title: '', description: '' });
      setEditingBank(null);
      setShowCreateForm(false);
      loadBanks();
    } catch (e) { alert(e.message); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this question bank and all its questions?')) return;
    try {
      await api.delete(`/banks/${id}`);
      loadBanks();
    } catch (e) { alert(e.message); }
  };

  const startEdit = (bank) => {
    setForm({ title: bank.title, description: bank.description || '' });
    setEditingBank(bank);
    setShowCreateForm(true);
  };

  const cancelForm = () => {
    setForm({ title: '', description: '' });
    setEditingBank(null);
    setShowCreateForm(false);
  };

  if (loading) return <LecturerShell><div className="loading-screen">Loading question banks...</div></LecturerShell>;

  return (
    <LecturerShell>
      <div className="question-bank-page">
        <section className="question-bank-hero">
          <div>
            <div className="question-bank-breadcrumb">
              <span>Dashboard</span>
              <ArrowRight size={14} />
              <span>Question Banks</span>
            </div>
            <h1>Question Banks</h1>
            <p>Organize your questions into banks for easy quiz creation.</p>
          </div>
          <button className="question-bank-cta" onClick={() => { cancelForm(); setShowCreateForm(true); }}>
            <Plus size={16} />
            <span>New Bank</span>
          </button>
        </section>

        <section className="question-bank-stats">
          <div className="question-bank-stat">
            <span className="question-bank-stat__icon question-bank-stat__icon--indigo"><Layers3 size={16} /></span>
            <div>
              <div className="question-bank-stat__label">Total Banks</div>
              <div className="question-bank-stat__value">{banks.length}</div>
            </div>
          </div>
          <div className="question-bank-stat">
            <span className="question-bank-stat__icon question-bank-stat__icon--green"><ListChecks size={16} /></span>
            <div>
              <div className="question-bank-stat__label">Total Questions</div>
              <div className="question-bank-stat__value">{totalQuestions}</div>
            </div>
          </div>
        </section>

        {showCreateForm && (
          <section className="question-bank-form card form-card">
            <h2>{editingBank ? 'Edit Bank' : 'Create New Bank'}</h2>
            <form onSubmit={editingBank ? handleUpdate : handleCreate}>
              <label>Bank Title</label>
              <input
                value={form.title}
                onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                placeholder="e.g. Database Fundamentals"
                required
              />
              <label>Description</label>
              <textarea
                value={form.description}
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                placeholder="Brief description of this question bank"
                rows={2}
              />
              <div className="form-actions">
                <button type="submit" className="btn-primary">{editingBank ? 'Update' : 'Create'} Bank</button>
                <button type="button" className="btn-secondary" onClick={cancelForm}>Cancel</button>
              </div>
            </form>
          </section>
        )}

        <section className="question-bank-toolbar">
          <div className="question-bank-search">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search banks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </section>

        <section className="question-bank-table-card">
          <div className="question-bank-table-card__header">
            <h2>Question Banks</h2>
            <span>{filteredBanks.length} banks</span>
          </div>

          {filteredBanks.length === 0 ? (
            <div className="empty-state">
              {banks.length === 0
                ? 'No question banks yet. Create your first bank to start adding questions.'
                : 'No banks match your search.'}
            </div>
          ) : (
            <div className="table-wrapper question-bank-table-wrap">
              <table className="questions-table">
                <thead>
                  <tr>
                    <th>Bank Name</th>
                    <th>Description</th>
                    <th>Questions</th>
                    <th>Created</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBanks.map((bank) => (
                    <tr key={bank.id} className="bank-row" onClick={() => navigate(`/banks/${bank.id}`)}>
                      <td className="question-text">{bank.title}</td>
                      <td className="topic-text">{bank.description || '-'}</td>
                      <td>
                        <span className="type-badge badge-default">
                          {bank._count?.questions || 0} questions
                        </span>
                      </td>
                      <td className="topic-text">
                        {new Date(bank.createdAt).toLocaleDateString()}
                      </td>
                      <td className="text-center" onClick={e => e.stopPropagation()}>
                        <button className="btn-action-trigger" title="Edit" onClick={() => startEdit(bank)}>
                          <Pencil size={14} />
                        </button>
                        <button className="btn-action-trigger btn-action-danger" title="Delete" onClick={() => handleDelete(bank.id)}>
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </LecturerShell>
  );
}
