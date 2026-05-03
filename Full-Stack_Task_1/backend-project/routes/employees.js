const express = require('express');
const db = require('../db'); // ibyo uba utangiye mu db.js
const router = express.Router();

// ---------- GET all employees ----------
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                employeeNumber, 
                FirstName, 
                LastName, 
                Position, 
                Address, 
                Telephone, 
                Gender, 
                DATE_FORMAT(hiredDate, '%Y-%m-%d') as hiredDate,
                DepartementCode
            FROM Employee
            ORDER BY employeeNumber
        `);
        res.json(rows);
    } catch (err) {
        console.error('GET /employees error:', err);
        res.status(500).json({ error: 'Database error: ' + err.message });
    }
});

// ---------- POST add new employee ----------
router.post('/', async (req, res) => {
    const {
        employeeNumber, FirstName, LastName, Position,
        Address, Telephone, Gender, hiredDate, DepartementCode
    } = req.body;

    // Validation
    if (!employeeNumber || !FirstName || !LastName || !Position || !Address || !Telephone || !Gender || !hiredDate || !DepartementCode) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Check for duplicate employee number
        const [existing] = await db.query('SELECT employeeNumber FROM Employee WHERE employeeNumber = ?', [employeeNumber]);
        if (existing.length > 0) {
            return res.status(409).json({ error: 'Employee number already exists' });
        }

        // Insert new employee
        await db.query(
            `INSERT INTO Employee 
            (employeeNumber, FirstName, LastName, Position, Address, Telephone, Gender, hiredDate, DepartementCode)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [employeeNumber, FirstName, LastName, Position, Address, Telephone, Gender, hiredDate, DepartementCode]
        );

        res.status(201).json({ success: true, message: 'Employee added successfully' });
    } catch (err) {
        console.error('POST /employees error:', err);
        res.status(500).json({ error: 'Database error: ' + err.message });
    }
});

// ---------- PUT update employee ----------
router.put('/:empNumber', async (req, res) => {
    const { empNumber } = req.params;
    const { FirstName, LastName, Position, Address, Telephone, Gender, hiredDate, DepartementCode } = req.body;

    try {
        // Check if employee exists
        const [existing] = await db.query('SELECT employeeNumber FROM Employee WHERE employeeNumber = ?', [empNumber]);
        if (existing.length === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        // Update employee
        await db.query(
            `UPDATE Employee SET 
                FirstName = ?, 
                LastName = ?, 
                Position = ?, 
                Address = ?, 
                Telephone = ?, 
                Gender = ?, 
                hiredDate = ?, 
                DepartementCode = ?
            WHERE employeeNumber = ?`,
            [FirstName, LastName, Position, Address, Telephone, Gender, hiredDate, DepartementCode, empNumber]
        );

        res.json({ success: true, message: 'Employee updated successfully' });
    } catch (err) {
        console.error('PUT /employees error:', err);
        res.status(500).json({ error: 'Database error: ' + err.message });
    }
});

// ---------- DELETE employee ----------
router.delete('/:empNumber', async (req, res) => {
    const { empNumber } = req.params;
    try {
        // Check if employee exists
        const [existing] = await db.query('SELECT employeeNumber FROM Employee WHERE employeeNumber = ?', [empNumber]);
        if (existing.length === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        // Delete (salary records will be deleted automatically due to ON DELETE CASCADE)
        await db.query('DELETE FROM Employee WHERE employeeNumber = ?', [empNumber]);

        res.json({ success: true, message: 'Employee and associated salaries deleted' });
    } catch (err) {
        console.error('DELETE /employees error:', err);
        res.status(500).json({ error: 'Database error: ' + err.message });
    }
});

module.exports = router;