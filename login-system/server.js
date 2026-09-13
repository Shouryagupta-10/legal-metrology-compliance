const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'rakshak_sentinel_super_secret_jwt_key_2026';
const DB_FILE = path.join(__dirname, 'users.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Simple Rate Limiting implementation (in-memory)
const loginAttempts = new Map();
const MAX_ATTEMPTS = 5;
const LOCKOUT_WINDOW = 15 * 60 * 1000; // 15 mins

function rateLimiter(req, res, next) {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    if (loginAttempts.has(ip)) {
        const record = loginAttempts.get(ip);
        if (now - record.firstAttempt > LOCKOUT_WINDOW) {
            loginAttempts.set(ip, { count: 1, firstAttempt: now });
        } else if (record.count >= MAX_ATTEMPTS) {
            const minutesLeft = Math.ceil((LOCKOUT_WINDOW - (now - record.firstAttempt)) / 60000);
            return res.status(429).json({
                error: `Too many failed login attempts. Account locked for ${minutesLeft} minute(s) for security.`
            });
        }
    }
    next();
}

function recordFailure(ip) {
    const now = Date.now();
    if (!loginAttempts.has(ip)) {
        loginAttempts.set(ip, { count: 1, firstAttempt: now });
    } else {
        const record = loginAttempts.get(ip);
        record.count += 1;
    }
}

function resetFailures(ip) {
    loginAttempts.delete(ip);
}

// Database helper functions
function loadUsers() {
    if (!fs.existsSync(DB_FILE)) {
        // Seed default verified law enforcement credentials
        const salt = bcrypt.genSaltSync(10);
        const defaultUsers = [
            {
                id: "USR-001",
                name: "Inspector Rajeev Sharma",
                email: "inspector@delhipolice.gov.in",
                passwordHash: bcrypt.hashSync("Password@123", salt),
                role: "Senior Crime Branch Inspector",
                district: "Central Delhi",
                createdAt: new Date().toISOString()
            },
            {
                id: "USR-002",
                name: "Sub-Inspector Priya Verma",
                email: "dispatch@delhipolice.gov.in",
                passwordHash: bcrypt.hashSync("Dispatch@2026", salt),
                role: "Rapid Patrol Dispatcher",
                district: "New Delhi",
                createdAt: new Date().toISOString()
            }
        ];
        fs.writeFileSync(DB_FILE, JSON.stringify(defaultUsers, null, 2));
        return defaultUsers;
    }
    try {
        const data = fs.readFileSync(DB_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
}

function saveUsers(users) {
    fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2));
}

// API Routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'online', service: 'Rakshak Sentinel Auth Gateway', timestamp: new Date() });
});

// POST /api/register
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password, role, district } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required fields.' });
        }

        if (password.length < 8) {
            return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
        }

        const users = loadUsers();
        const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
        if (existing) {
            return res.status(409).json({ error: 'An account with this email address already exists.' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = {
            id: `USR-${Date.now().toString().slice(-5)}`,
            name: name.trim(),
            email: email.toLowerCase().trim(),
            passwordHash,
            role: role || 'Verified Officer',
            district: district || 'Delhi NCR',
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        saveUsers(users);

        const token = jwt.sign(
            { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role, district: newUser.district },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        return res.status(201).json({
            message: 'Account registered successfully.',
            token,
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                district: newUser.district
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ error: 'Internal server error during registration.' });
    }
});

// POST /api/login
app.post('/api/login', rateLimiter, async (req, res) => {
    try {
        const { email, password } = req.body;
        const ip = req.ip || req.connection.remoteAddress;

        if (!email || !password) {
            return res.status(400).json({ error: 'Please provide both email and password.' });
        }

        const users = loadUsers();
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());

        if (!user) {
            recordFailure(ip);
            return res.status(401).json({ error: 'Invalid credentials. Please verify your email and password.' });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            recordFailure(ip);
            return res.status(401).json({ error: 'Invalid credentials. Please verify your email and password.' });
        }

        resetFailures(ip);

        const token = jwt.sign(
            { id: user.id, email: user.email, name: user.name, role: user.role, district: user.district },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        return res.json({
            message: 'Authentication successful.',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                district: user.district
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ error: 'Internal server error during authentication.' });
    }
});

// Auth Verification Middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required.' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Session expired or token invalid.' });
        }
        req.user = user;
        next();
    });
}

// GET /api/me
app.get('/api/me', authenticateToken, (req, res) => {
    res.json({ user: req.user });
});

app.listen(PORT, () => {
    console.log(`🛡️ Rakshak Authentication Server listening on port ${PORT}`);
    console.log(`🌐 Open http://localhost:${PORT} in your browser to view the login portal.`);
});
