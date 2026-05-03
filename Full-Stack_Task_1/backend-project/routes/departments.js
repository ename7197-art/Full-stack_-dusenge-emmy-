const express = require('express');
const router = express.Router();

// Mock data for departments
let departments = [
    { DepartementCode: "ADMS", DepartementName: "Administration Staff", GrossSalary: "600000.00" },
    { DepartementCode: "CW", DepartementName: "Carwash", GrossSalary: "300000.00" },
    { DepartementCode: "MC", DepartementName: "Mechanic", GrossSalary: "450000.00" },
    { DepartementCode: "ST", DepartementName: "Stock", GrossSalary: "350000.00" }
];

router.get('/', (req, res) => {
    try {
        res.json(departments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', (req, res) => {
    const { DepartementCode, DepartementName, GrossSalary } = req.body;
    
    // Validation
    if (!DepartementCode || !DepartementName || !GrossSalary) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    
    try {
        const existing = departments.find(dept => dept.DepartementCode === DepartementCode);
        if (existing) {
            return res.status(409).json({ error: 'Department code already exists' });
        }
        departments.push({ DepartementCode, DepartementName, GrossSalary });
        res.json({ success: true });
    } catch (err) {
        console.error('POST /departments error:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;