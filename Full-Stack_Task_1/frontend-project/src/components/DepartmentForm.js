import { useState } from 'react';
import api from '../api';

export default function DepartmentForm() {
    const [form, setForm] = useState({ DepartementCode: '', DepartementName: '', GrossSalary: '' });
    const [msg, setMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/departments', form);
            setMsg('✅ Department added');
            setForm({ DepartementCode: '', DepartementName: '', GrossSalary: '' });
            setTimeout(() => setMsg(''), 3000);
        } catch (err) {
            console.error('Department addition error:', err);
            if (err.response?.data?.error) {
                setMsg(`❌ ${err.response.data.error}`);
            } else {
                setMsg('❌ Error adding department');
            }
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Add Department</h2>
            {msg && <div className="mb-2 p-2 bg-green-100 rounded">{msg}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <input name="DepartementCode" placeholder="Code (e.g., HR)" value={form.DepartementCode} onChange={e => setForm({...form, DepartementCode: e.target.value})} className="border p-2 w-full" required />
                <input name="DepartementName" placeholder="Name" value={form.DepartementName} onChange={e => setForm({...form, DepartementName: e.target.value})} className="border p-2 w-full" required />
                <input name="GrossSalary" type="number" placeholder="Gross Salary" value={form.GrossSalary} onChange={e => setForm({...form, GrossSalary: e.target.value})} className="border p-2 w-full" required />
                <button type="submit" className="bg-blue-600 text-white w-full p-2 rounded">Add Department</button>
            </form>
        </div>
    );
}