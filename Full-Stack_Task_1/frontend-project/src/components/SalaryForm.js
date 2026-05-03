import { useState, useEffect } from 'react';
import api from '../api';

export default function SalaryForm({ onSalaryAdded }) {
    const [employees, setEmployees] = useState([]);
    const [form, setForm] = useState({ employeeNumber: '', month: '', GrossSalary: '', TotalDeduction: 0 });
    const [msg, setMsg] = useState('');

    useEffect(() => {
        api.get('/employees').then(res => setEmployees(res.data)).catch(()=>{});
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/salaries', form);
            setMsg('✅ Salary added');
            setForm({ employeeNumber: '', month: '', GrossSalary: '', TotalDeduction: 0 });
            if (onSalaryAdded) onSalaryAdded();
            setTimeout(() => setMsg(''), 3000);
        } catch (err) {
            setMsg('❌ Error adding salary');
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow rounded">
            <h2 className="text-2xl font-bold mb-4">Add Salary</h2>
            {msg && <div className="mb-2 p-2 bg-green-100 rounded">{msg}</div>}
            <form onSubmit={handleSubmit} className="space-y-3">
                <select value={form.employeeNumber} onChange={e => setForm({...form, employeeNumber: e.target.value})} className="border p-2 w-full" required>
                    <option value="">Select Employee</option>
                    {employees.map(emp => <option key={emp.employeeNumber} value={emp.employeeNumber}>{emp.FirstName} {emp.LastName} ({emp.employeeNumber})</option>)}
                </select>
                <input type="month" value={form.month} onChange={e => setForm({...form, month: e.target.value})} className="border p-2 w-full" required />
                <input type="number" placeholder="Gross Salary" value={form.GrossSalary} onChange={e => setForm({...form, GrossSalary: e.target.value})} className="border p-2 w-full" required />
                <input type="number" placeholder="Total Deduction" value={form.TotalDeduction} onChange={e => setForm({...form, TotalDeduction: e.target.value})} className="border p-2 w-full" />
                <button type="submit" className="bg-green-600 text-white p-2 rounded w-full">Add Salary</button>
            </form>
        </div>
    );
}