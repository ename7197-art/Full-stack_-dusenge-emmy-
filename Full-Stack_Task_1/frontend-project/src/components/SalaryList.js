import { useState, useEffect } from 'react';
import api from '../api';

export default function SalaryList() {
    const [salaries, setSalaries] = useState([]);
    const [editing, setEditing] = useState(null);
    const [editForm, setEditForm] = useState({});

    const fetchSalaries = async () => {
        const res = await api.get('/salaries');
        setSalaries(res.data);
    };

    useEffect(() => { fetchSalaries(); }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Delete this salary?')) {
            await api.delete(`/salaries/${id}`);
            fetchSalaries();
        }
    };

    const handleEdit = (salary) => {
        setEditing(salary.id);
        setEditForm({ month: salary.month.slice(0,7), GrossSalary: salary.GrossSalary, TotalDeduction: salary.TotalDeduction });
    };

    const handleUpdate = async (id) => {
        await api.put(`/salaries/${id}`, editForm);
        setEditing(null);
        fetchSalaries();
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">📊 Salary List (CRUD)</h2>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse border">
                    <thead><tr className="bg-gray-200">
                        <th className="border p-2">Employee</th><th className="border p-2">Month</th><th className="border p-2">Gross</th><th className="border p-2">Deduction</th><th className="border p-2">Net</th><th className="border p-2">Actions</th>
                    </tr></thead>
                    <tbody>
                        {salaries.map(s => (
                            <tr key={s.id}>
                                {editing === s.id ? (
                                    <>
                                        <td className="border p-2">{s.employeeName}</td>
                                        <td className="border p-2"><input type="month" value={editForm.month} onChange={e => setEditForm({...editForm, month: e.target.value})} className="border p-1" /></td>
                                        <td className="border p-2"><input type="number" value={editForm.GrossSalary} onChange={e => setEditForm({...editForm, GrossSalary: e.target.value})} className="border p-1 w-24" /></td>
                                        <td className="border p-2"><input type="number" value={editForm.TotalDeduction} onChange={e => setEditForm({...editForm, TotalDeduction: e.target.value})} className="border p-1 w-24" /></td>
                                        <td className="border p-2">{editForm.GrossSalary - editForm.TotalDeduction}</td>
                                        <td className="border p-2"><button onClick={() => handleUpdate(s.id)} className="bg-blue-500 text-white p-1 px-2 rounded mr-1">Save</button><button onClick={() => setEditing(null)} className="bg-gray-500 p-1 px-2 rounded">Cancel</button></td>
                                    </>
                                ) : (
                                    <>
                                        <td className="border p-2">{s.employeeName}</td>
                                        <td className="border p-2">{s.month}</td>
                                        <td className="border p-2">{Number(s.GrossSalary).toLocaleString()}</td>
                                        <td className="border p-2">{Number(s.TotalDeduction).toLocaleString()}</td>
                                        <td className="border p-2 font-bold">{Number(s.NetSalary).toLocaleString()}</td>
                                        <td className="border p-2"><button onClick={() => handleEdit(s)} className="bg-yellow-500 text-white p-1 px-2 rounded mr-1">Edit</button><button onClick={() => handleDelete(s.id)} className="bg-red-600 text-white p-1 px-2 rounded">Delete</button></td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}