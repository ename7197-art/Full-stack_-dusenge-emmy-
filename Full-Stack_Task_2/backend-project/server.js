const express = require('express');
const session = require('express-session');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { pool } = require('./config/database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3003'],
    credentials: true
}));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set to true in production with HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.session.userId) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized - Please login' });
    }
};

// Authentication Routes
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const [users] = await pool.execute(
            'SELECT * FROM Users WHERE Username = ?',
            [username]
        );
        
        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const user = users[0];
        const isPasswordValid = await bcrypt.compare(password, user.Password);
        
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        req.session.userId = user.UserID;
        req.session.username = user.Username;
        req.session.role = user.Role;
        
        res.json({
            message: 'Login successful',
            user: {
                id: user.UserID,
                username: user.Username,
                role: user.Role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/auth/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.json({ message: 'Logout successful' });
    });
});

app.get('/api/auth/check', (req, res) => {
    if (req.session.userId) {
        res.json({
            authenticated: true,
            user: {
                id: req.session.userId,
                username: req.session.username,
                role: req.session.role
            }
        });
    } else {
        res.json({ authenticated: false });
    }
});

// Car Routes
app.get('/api/cars', isAuthenticated, async (req, res) => {
    try {
        const [cars] = await pool.execute('SELECT * FROM Car ORDER BY PlateNumber');
        res.json(cars);
    } catch (error) {
        console.error('Error fetching cars:', error);
        res.status(500).json({ error: 'Failed to fetch cars' });
    }
});

app.post('/api/cars', isAuthenticated, async (req, res) => {
    try {
        const { PlateNumber, DriverName, PhoneNumber } = req.body;
        
        const [result] = await pool.execute(
            'INSERT INTO Car (PlateNumber, DriverName, PhoneNumber) VALUES (?, ?, ?)',
            [PlateNumber, DriverName, PhoneNumber]
        );
        
        res.json({ message: 'Car added successfully', id: result.insertId });
    } catch (error) {
        console.error('Error adding car:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ error: 'Car with this plate number already exists' });
        } else {
            res.status(500).json({ error: 'Failed to add car' });
        }
    }
});

app.put('/api/cars/:plateNumber', isAuthenticated, async (req, res) => {
    try {
        const { plateNumber } = req.params;
        const { DriverName, PhoneNumber } = req.body;
        
        const [result] = await pool.execute(
            'UPDATE Car SET DriverName = ?, PhoneNumber = ? WHERE PlateNumber = ?',
            [DriverName, PhoneNumber, plateNumber]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Car not found' });
        }
        
        res.json({ message: 'Car updated successfully' });
    } catch (error) {
        console.error('Error updating car:', error);
        res.status(500).json({ error: 'Failed to update car' });
    }
});

app.delete('/api/cars/:plateNumber', isAuthenticated, async (req, res) => {
    try {
        const { plateNumber } = req.params;
        
        const [result] = await pool.execute(
            'DELETE FROM Car WHERE PlateNumber = ?',
            [plateNumber]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Car not found' });
        }
        
        res.json({ message: 'Car deleted successfully' });
    } catch (error) {
        console.error('Error deleting car:', error);
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            res.status(400).json({ error: 'Cannot delete car - it has parking records' });
        } else {
            res.status(500).json({ error: 'Failed to delete car' });
        }
    }
});

// ParkingSlot Routes
app.get('/api/parking-slots', isAuthenticated, async (req, res) => {
    try {
        const [slots] = await pool.execute('SELECT * FROM ParkingSlot ORDER BY SlotNumber');
        res.json(slots);
    } catch (error) {
        console.error('Error fetching parking slots:', error);
        res.status(500).json({ error: 'Failed to fetch parking slots' });
    }
});

app.post('/api/parking-slots', isAuthenticated, async (req, res) => {
    try {
        const { SlotNumber, SlotStatus } = req.body;
        
        const [result] = await pool.execute(
            'INSERT INTO ParkingSlot (SlotNumber, SlotStatus) VALUES (?, ?)',
            [SlotNumber, SlotStatus || 'Available']
        );
        
        res.json({ message: 'Parking slot added successfully', id: result.insertId });
    } catch (error) {
        console.error('Error adding parking slot:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ error: 'Parking slot with this number already exists' });
        } else {
            res.status(500).json({ error: 'Failed to add parking slot' });
        }
    }
});

// ParkingRecord Routes
app.get('/api/parking-records', isAuthenticated, async (req, res) => {
    try {
        const [records] = await pool.execute(`
            SELECT pr.*, c.DriverName, c.PhoneNumber, ps.SlotStatus
            FROM ParkingRecord pr
            JOIN Car c ON pr.PlateNumber = c.PlateNumber
            JOIN ParkingSlot ps ON pr.SlotNumber = ps.SlotNumber
            ORDER BY pr.EntryTime DESC
        `);
        res.json(records);
    } catch (error) {
        console.error('Error fetching parking records:', error);
        res.status(500).json({ error: 'Failed to fetch parking records' });
    }
});

app.post('/api/parking-records', isAuthenticated, async (req, res) => {
    try {
        const { PlateNumber, SlotNumber, EntryTime } = req.body;
        
        // Check if slot is available
        const [slotCheck] = await pool.execute(
            'SELECT SlotStatus FROM ParkingSlot WHERE SlotNumber = ?',
            [SlotNumber]
        );
        
        if (slotCheck.length === 0) {
            return res.status(404).json({ error: 'Parking slot not found' });
        }
        
        if (slotCheck[0].SlotStatus !== 'Available') {
            return res.status(400).json({ error: 'Parking slot is not available' });
        }
        
        const [result] = await pool.execute(
            'INSERT INTO ParkingRecord (PlateNumber, SlotNumber, EntryTime) VALUES (?, ?, ?)',
            [PlateNumber, SlotNumber, EntryTime || new Date()]
        );
        
        res.json({ message: 'Parking record created successfully', id: result.insertId });
    } catch (error) {
        console.error('Error creating parking record:', error);
        res.status(500).json({ error: 'Failed to create parking record' });
    }
});

app.put('/api/parking-records/:recordId/exit', isAuthenticated, async (req, res) => {
    try {
        const { recordId } = req.params;
        const { ExitTime } = req.body;
        
        // Check if record exists and doesn't have exit time
        const [recordCheck] = await pool.execute(
            'SELECT * FROM ParkingRecord WHERE RecordID = ? AND ExitTime IS NULL',
            [recordId]
        );
        
        if (recordCheck.length === 0) {
            return res.status(404).json({ error: 'Active parking record not found' });
        }
        
        const [result] = await pool.execute(
            'UPDATE ParkingRecord SET ExitTime = ? WHERE RecordID = ?',
            [ExitTime || new Date(), recordId]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Parking record not found' });
        }
        
        // Get the updated record with duration
        const [updatedRecord] = await pool.execute(
            'SELECT * FROM ParkingRecord WHERE RecordID = ?',
            [recordId]
        );
        
        res.json({ 
            message: 'Exit time recorded successfully',
            record: updatedRecord[0]
        });
    } catch (error) {
        console.error('Error updating parking record:', error);
        res.status(500).json({ error: 'Failed to update parking record' });
    }
});

// Payment Routes
app.post('/api/payments', isAuthenticated, async (req, res) => {
    try {
        const { RecordID } = req.body;
        
        // Get parking record with duration
        const [record] = await pool.execute(
            'SELECT * FROM ParkingRecord WHERE RecordID = ? AND ExitTime IS NOT NULL',
            [RecordID]
        );
        
        if (record.length === 0) {
            return res.status(404).json({ error: 'Completed parking record not found' });
        }
        
        const parkingRecord = record[0];
        const duration = parkingRecord.Duration;
        const amountPaid = duration * 500; // 500 RWF per hour
        
        const [result] = await pool.execute(
            'INSERT INTO Payment (RecordID, AmountPaid, PaymentDate) VALUES (?, ?, ?)',
            [RecordID, amountPaid, new Date()]
        );
        
        res.json({ 
            message: 'Payment recorded successfully', 
            paymentId: result.insertId,
            amountPaid
        });
    } catch (error) {
        console.error('Error creating payment:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ error: 'Payment already recorded for this parking record' });
        } else {
            res.status(500).json({ error: 'Failed to create payment' });
        }
    }
});

app.get('/api/payments', isAuthenticated, async (req, res) => {
    try {
        const [payments] = await pool.execute(`
            SELECT p.*, pr.PlateNumber, pr.EntryTime, pr.ExitTime, pr.Duration, c.DriverName
            FROM Payment p
            JOIN ParkingRecord pr ON p.RecordID = pr.RecordID
            JOIN Car c ON pr.PlateNumber = c.PlateNumber
            ORDER BY p.PaymentDate DESC
        `);
        res.json(payments);
    } catch (error) {
        console.error('Error fetching payments:', error);
        res.status(500).json({ error: 'Failed to fetch payments' });
    }
});

// Reports Routes
app.get('/api/reports/daily', isAuthenticated, async (req, res) => {
    try {
        const { date } = req.query;
        const reportDate = date || new Date().toISOString().split('T')[0];
        
        const [report] = await pool.execute(`
            SELECT 
                p.PaymentID,
                pr.PlateNumber,
                pr.EntryTime,
                pr.ExitTime,
                pr.Duration,
                p.AmountPaid,
                p.PaymentDate,
                c.DriverName
            FROM Payment p
            JOIN ParkingRecord pr ON p.RecordID = pr.RecordID
            JOIN Car c ON pr.PlateNumber = c.PlateNumber
            WHERE DATE(p.PaymentDate) = ?
            ORDER BY p.PaymentDate DESC
        `, [reportDate]);
        
        const [summary] = await pool.execute(`
            SELECT 
                COUNT(*) as total_transactions,
                SUM(p.AmountPaid) as total_revenue,
                AVG(pr.Duration) as avg_duration
            FROM Payment p
            JOIN ParkingRecord pr ON p.RecordID = pr.RecordID
            WHERE DATE(p.PaymentDate) = ?
        `, [reportDate]);
        
        res.json({
            date: reportDate,
            transactions: report,
            summary: summary[0]
        });
    } catch (error) {
        console.error('Error generating daily report:', error);
        res.status(500).json({ error: 'Failed to generate daily report' });
    }
});

// Generate Bill
app.get('/api/bill/:recordId', isAuthenticated, async (req, res) => {
    try {
        const { recordId } = req.params;
        
        const [bill] = await pool.execute(`
            SELECT 
                pr.RecordID,
                pr.PlateNumber,
                pr.EntryTime,
                pr.ExitTime,
                pr.Duration,
                p.AmountPaid,
                p.PaymentDate,
                c.DriverName,
                c.PhoneNumber
            FROM ParkingRecord pr
            JOIN Payment p ON pr.RecordID = p.RecordID
            JOIN Car c ON pr.PlateNumber = c.PlateNumber
            WHERE pr.RecordID = ?
        `, [recordId]);
        
        if (bill.length === 0) {
            return res.status(404).json({ error: 'Bill not found' });
        }
        
        res.json(bill[0]);
    } catch (error) {
        console.error('Error generating bill:', error);
        res.status(500).json({ error: 'Failed to generate bill' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
