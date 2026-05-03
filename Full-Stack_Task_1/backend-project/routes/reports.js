const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/monthly', async (req, res) => {
    const { month } = req.query;
    if (!month) return res.status(400).json({ error: 'Month required (YYYY-MM)' });
    const sql = `
        SELECT e.FirstName, e.LastName, e.Position, d.DepartementName, s.NetSalary
        FROM Salary s
        JOIN Employee e ON s.employeeNumber = e.employeeNumber
        LEFT JOIN Department d ON e.DepartementCode = d.DepartementCode
        WHERE DATE_FORMAT(s.month, '%Y-%m') = ?
    `;
    const [rows] = await db.query(sql, [month]);
    res.json(rows);
});

module.exports = router;