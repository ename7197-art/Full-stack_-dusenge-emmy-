import { useState, useEffect } from 'react';
import api from '../api';

export default function EmployeeList() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [editing, setEditing] = useState(null);
    const [editData, setEditData] = useState({});
    const [departments, setDepartments] = useState([]);

    // Load employees and departments
    const fetchEmployees = async () => {
        setLoading(true);
        try {
            console.log('Fetching employees...');
            const res = await api.get('/employees');
            console.log('Employees data:', res.data);
            setEmployees(res.data);
            setMessage('');
        } catch (err) {
            console.error('Failed to load employees:', err);
            setMessage('Failed to load employees');
        } finally {
            setLoading(false);
        }
    };

    const fetchDepartments = async () => {
        try {
            const res = await api.get('/departments');
            setDepartments(res.data);
        } catch (err) {}
    };

    useEffect(() => {
        fetchEmployees();
        fetchDepartments();
    }, []);

    // Delete employee
    const handleDelete = async (empNumber) => {
        if (window.confirm(`Delete employee ${empNumber}?`)) {
            try {
                await api.delete(`/employees/${empNumber}`);
                setMessage(`✅ ${empNumber} deleted`);
                fetchEmployees();
                setTimeout(() => setMessage(''), 3000);
            } catch (err) {
                setMessage('❌ Delete failed');
            }
        }
    };

    // Start editing
    const startEdit = (emp) => {
        setEditing(emp.employeeNumber);
        setEditData({
            FirstName: emp.FirstName,
            LastName: emp.LastName,
            Position: emp.Position,
            Address: emp.Address,
            Telephone: emp.Telephone,
            Gender: emp.Gender,
            hiredDate: emp.hiredDate,
            DepartementCode: emp.DepartementCode
        });
    };

    // Save edit
    const saveEdit = async (empNumber) => {
        try {
            await api.put(`/employees/${empNumber}`, editData);
            setMessage(`✅ ${empNumber} updated`);
            setEditing(null);
            fetchEmployees();
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setMessage('❌ Update failed');
        }
    };

    const handleEditChange = (e) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    if (loading) return <div className="p-6">Loading employees...</div>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">📋 Employees List</h2>
            {message && <div className="mb-4 p-2 bg-green-100 text-green-800 rounded">{message}</div>}
            
            {/* Debug info */}
            <div className="mb-4 text-sm text-gray-600">
                Loading: {loading ? 'Yes' : 'No'} | 
                Employees count: {employees.length} | 
                Departments count: {departments.length}
            </div>
            
            {employees.length === 0 ? (
                <p>No employees found. Add one from the Employee page.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border p-2">Emp #</th><th className="border p-2">First Name</th><th className="border p-2">Last Name</th><th className="border p-2">Position</th>
                                <th className="border p-2">Address</th><th className="border p-2">Telephone</th><th className="border p-2">Gender</th><th className="border p-2">Hired Date</th><th className="border p-2">Dept</th><th className="border p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map(emp => (
                                <tr key={emp.employeeNumber} className="hover:bg-gray-50">
                                    {editing === emp.employeeNumber ? (
                                        <>
                                            <td className="border p-2">{emp.employeeNumber}</td>
                                            <td className="border p-2"><input name="FirstName" value={editData.FirstName} onChange={handleEditChange} className="border p-1 w-24" /></td>
                                            <td className="border p-2"><input name="LastName" value={editData.LastName} onChange={handleEditChange} className="border p-1 w-24" /></td>
                                            <td className="border p-2"><input name="Position" value={editData.Position} onChange={handleEditChange} className="border p-1 w-28" /></td>
                                            <td className="border p-2"><input name="Address" value={editData.Address} onChange={handleEditChange} className="border p-1 w-32" /></td>
                                            <td className="border p-2"><input name="Telephone" value={editData.Telephone} onChange={handleEditChange} className="border p-1 w-28" /></td>
                                            <td className="border p-2">
                                                <select name="Gender" value={editData.Gender} onChange={handleEditChange}>
                                                    <option>Male</option><option>Female</option>
                                                </select>
                                            </td>
                                            <td className="border p-2"><input name="hiredDate" type="date" value={editData.hiredDate} onChange={handleEditChange} /></td>
                                            <td className="border p-2">
                                                <select name="DepartementCode" value={editData.DepartementCode} onChange={handleEditChange}>
                                                    <option value="">--</option>
                                                    {departments.map(d => <option key={d.DepartementCode} value={d.DepartementCode}>{d.DepartementCode}</option>)}
                                                </select>
                                            </td>
                                            <td className="border p-2">
                                                <button onClick={() => saveEdit(emp.employeeNumber)} className="bg-green-600 text-white px-2 py-1 rounded mr-1">Save</button>
                                                <button onClick={() => setEditing(null)} className="bg-gray-500 text-white px-2 py-1 rounded">Cancel</button>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="border p-2 font-mono">{emp.employeeNumber}</td>
                                            <td className="border p-2">{emp.FirstName}</td>
                                            <td className="border p-2">{emp.LastName}</td>
                                            <td className="border p-2">{emp.Position}</td>
                                            <td className="border p-2">{emp.Address}</td>
                                            <td className="border p-2">{emp.Telephone}</td>
                                            <td className="border p-2">{emp.Gender}</td>
                                            <td className="border p-2">{emp.hiredDate}</td>
                                            <td className="border p-2">{emp.DepartementCode}</td>
                                            <td className="border p-2">
                                                <button onClick={() => startEdit(emp)} className="bg-yellow-500 text-white px-2 py-1 rounded mr-1">Edit</button>
                                                <button onClick={() => handleDelete(emp.employeeNumber)} className="bg-red-600 text-white px-2 py-1 rounded">Delete</button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}