const express = require('express');
const router = express.Router();

// Mock data for salaries
let salaries = [
    {
        id: 1,
        employeeNumber: "001",
        month: "2024-01-15",
        GrossSalary: "300000.00",
        TotalDeduction: "12000.00",
        NetSalary: "288000.00",
        employeeName: "emmy dusenge",
        Position: "keep",
        DepartementName: "Mechanic"
    },
    {
        id: 2,
        employeeNumber: "EMP001", 
        month: "2024-01-15",
        GrossSalary: "400000.00",
        TotalDeduction: "15000.00",
        NetSalary: "385000.00",
        employeeName: "John Doe",
        Position: "Manager",
        DepartementName: "Carwash"
    }
];

router.get('/', (req, res) => {
    try {
        res.json(salaries);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', (req, res) => {
    const { employeeNumber, month, GrossSalary, TotalDeduction } = req.body;
    const NetSalary = GrossSalary - TotalDeduction;
    try {
        const newSalary = {
            id: salaries.length + 1,
            employeeNumber,
            month,
            GrossSalary,
            TotalDeduction,
            NetSalary,
            employeeName: "Unknown Employee",
            Position: "Unknown",
            DepartementName: "Unknown"
        };
        salaries.push(newSalary);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/:id', (req, res) => {
    const { GrossSalary, TotalDeduction, month } = req.body;
    const NetSalary = GrossSalary - TotalDeduction;
    try {
        const index = salaries.findIndex(s => s.id == req.params.id);
        if (index === -1) {
            return res.status(404).json({ error: 'Salary record not found' });
        }
        salaries[index] = { ...salaries[index], month, GrossSalary, TotalDeduction, NetSalary };
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:id', (req, res) => {
    try {
        const index = salaries.findIndex(s => s.id == req.params.id);
        if (index === -1) {
            return res.status(404).json({ error: 'Salary record not found' });
        }
        salaries.splice(index, 1);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;