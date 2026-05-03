const express = require('express');
const router = express.Router();

// Mock user storage (in production, use a database)
const users = [
    { username: 'admin', password: 'admin123', email: 'admin@company.com', fullName: 'System Administrator' }
];

router.post('/register', (req, res) => {
    const { username, email, password, fullName, phone } = req.body;
    
    // Validation
    if (!username || !email || !password) {
        return res.status(400).json({ 
            success: false, 
            error: 'Username, email, and password are required' 
        });
    }
    
    if (password.length < 6) {
        return res.status(400).json({ 
            success: false, 
            error: 'Password must be at least 6 characters long' 
        });
    }
    
    // Check if user already exists
    const existingUser = users.find(u => u.username === username || u.email === email);
    if (existingUser) {
        return res.status(409).json({ 
            success: false, 
            error: 'Username or email already exists' 
        });
    }
    
    // Create new user (in production, hash the password)
    const newUser = {
        username,
        email,
        password, // In production, hash this with bcrypt
        fullName: fullName || '',
        phone: phone || '',
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    
    // Create session for new user
    req.session.user = { 
        username: newUser.username, 
        email: newUser.email,
        fullName: newUser.fullName 
    };
    
    res.json({ 
        success: true, 
        message: 'Account created successfully',
        user: {
            username: newUser.username,
            email: newUser.email,
            fullName: newUser.fullName
        }
    });
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    // Find user by username or email
    const user = users.find(u => u.username === username || u.email === username);
    
    if (user && user.password === password) {
        req.session.user = { 
            username: user.username, 
            email: user.email,
            fullName: user.fullName 
        };
        res.json({ success: true, message: 'Login successful' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

router.get('/check', (req, res) => {
    if (req.session.user) res.json({ loggedIn: true, user: req.session.user });
    else res.json({ loggedIn: false });
});

module.exports = router;