import { useState, useEffect } from 'react';
import api from '../api';

export default function EmployeeForm() {
    const [form, setForm] = useState({ employeeNumber: '', FirstName: '', LastName: '', Position: '', Address: '', Telephone: '', Gender: 'Male', hiredDate: '', DepartementCode: '' });
    const [depts, setDepts] = useState([]);
    const [msg, setMsg] = useState({ text: '', type: '' });

    useEffect(() => {
        api.get('/departments').then(res => setDepts(res.data));
    }, []);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/employees', form);
            setMsg({ text: '✅ Employee added successfully!', type: 'success' });
            setForm({ employeeNumber: '', FirstName: '', LastName: '', Position: '', Address: '', Telephone: '', Gender: 'Male', hiredDate: '', DepartementCode: '' });
            setTimeout(() => setMsg({ text: '', type: '' }), 3000);
        } catch (err) {
            const errorMsg = err.response?.data?.error || 'Error adding employee';
            setMsg({ text: '❌ ' + errorMsg, type: 'error' });
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Add Employee</h2>
            {msg.text && <div className={`mb-2 p-2 rounded ${msg.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{msg.text}</div>}
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                <input name="employeeNumber" placeholder="Employee Number" value={form.employeeNumber} onChange={handleChange} className="border p-2" required />
                <input name="FirstName" placeholder="First Name" value={form.FirstName} onChange={handleChange} className="border p-2" required />
                <input name="LastName" placeholder="Last Name" value={form.LastName} onChange={handleChange} className="border p-2" required />
                <input name="Position" placeholder="Position" value={form.Position} onChange={handleChange} className="border p-2" required />
                <input name="Address" placeholder="Address" value={form.Address} onChange={handleChange} className="border p-2" required />
                <input name="Telephone" placeholder="Telephone" value={form.Telephone} onChange={handleChange} className="border p-2" required />
                <select name="Gender" value={form.Gender} onChange={handleChange} className="border p-2">
                    <option>Male</option><option>Female</option>
                </select>
                <input name="hiredDate" type="date" value={form.hiredDate} onChange={handleChange} className="border p-2" required />
                <select name="DepartementCode" value={form.DepartementCode} onChange={handleChange} className="border p-2" required>
                    <option value="">Select Department</option>
                    {depts.map(d => <option key={d.DepartementCode} value={d.DepartementCode}>{d.DepartementName}</option>)}
                </select>
                <button type="submit" className="col-span-2 bg-blue-600 text-white p-2 rounded">Add Employee</button>
            </form>
        </div>
    );
}