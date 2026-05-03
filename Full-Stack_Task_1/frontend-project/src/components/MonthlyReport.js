import { useState } from 'react';
import api from '../api';

export default function Reports() {
    const [month, setMonth] = useState('');
    const [report, setReport] = useState([]);
    const [show, setShow] = useState(false);

    const generateReport = async () => {
        if (!month) return;
        const res = await api.get(`/reports/monthly?month=${month}`);
        setReport(res.data);
        setShow(true);
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">📄 Monthly Payroll Report</h2>
            <div className="flex gap-2 mb-4">
                <input type="month" value={month} onChange={e => setMonth(e.target.value)} className="border p-2 rounded" />
                <button onClick={generateReport} className="bg-blue-600 text-white p-2 rounded">Generate</button>
            </div>
            {show && (
                <div className="overflow-x-auto">
                    <table className="w-full border">
                        <thead><tr className="bg-gray-200"><th className="border p-2">First Name</th><th className="border p-2">Last Name</th><th className="border p-2">Position</th><th className="border p-2">Department</th><th className="border p-2">Net Salary (RWF)</th></tr></thead>
                        <tbody>
                            {report.map((r, idx) => (
                                <tr key={idx}>
                                    <td className="border p-2">{r.FirstName}</td><td className="border p-2">{r.LastName}</td><td className="border p-2">{r.Position}</td><td className="border p-2">{r.DepartementName}</td><td className="border p-2 font-bold">{Number(r.NetSalary).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}