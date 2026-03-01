require('dotenv').config();
const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.SECRET_KEY || 'black_banana_secret_key_change_in_prod'; // Simple secret key
const ADMIN_SECRET = process.env.ADMIN_SECRET || '123123'; // Key to create an admin account

// --- CONFIGURATIONS ---

// 1. Supabase Initialization
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_KEY || '';
let supabase = null;

if (SUPABASE_URL && SUPABASE_KEY) {
    supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log('Supabase client initialized.');
} else {
    console.log('Supabase credentials not found. Falling back to local JSON DB.');
}

// 2. Nodemailer Initialization
let transporter = null;
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
        service: 'gmail', // You can change this to your preferred email service provider
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    console.log('Nodemailer transporter initialized.');
} else {
    console.log('Nodemailer credentials not found. Email sending is disabled.');
}

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' })); // Increased limit for base64 images/videos
app.use(express.static(path.join(__dirname, '../'))); // Serve static files from root

// Database File Path
const DB_FILE = path.join(__dirname, '../data/db.json');

// --- DATABASE HELPERS ---

function initDB() {
    if (!fs.existsSync(DB_FILE)) {
        const defaultData = {
            admins: [
                { username: 'admin@blackbanana.com', password: 'password123' }
            ], // { username, password } - strictly plain text for this demo level
            projects: [],
            reviews: [],
            expertise: [],
            messages: []
        };
        // Add default data from script.js logic manually here or let frontend populate?
        // Let's populate defaults for a better starting experience
        defaultData.projects = [
            {
                type: 'UGC',
                title: 'Fashion Week',
                media: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-recording-a-video-on-her-phone-39739-large.mp4',
                isVideo: true
            },
            {
                type: 'Production',
                title: 'Night Life',
                media: 'https://assets.mixkit.co/videos/preview/mixkit-fireworks-illuminating-the-beach-at-night-4168-large.mp4',
                isVideo: true
            },
            {
                type: 'Influencer',
                title: 'Neon Dance',
                media: 'https://assets.mixkit.co/videos/preview/mixkit-man-dancing-under-changing-lights-1240-large.mp4',
                isVideo: true
            },
            {
                type: 'Branding',
                title: 'Fluid Identity',
                media: 'https://video.wixstatic.com/video/11062b_92619c730c4b4b0bb27ea39c4276a53b/1080p/mp4/file.mp4',
                isVideo: true
            },
            {
                type: 'CGI',
                title: 'Cosmos',
                media: 'https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4',
                isVideo: true
            }
        ];
        defaultData.reviews = [
            {
                name: 'Krutarth Kansagra',
                role: 'CEO, Edverb',
                text: "Black Banana isn't an agency, they are a weapon. Our conversion rate doubled in 30 days.",
                rating: 5
            },
            {
                name: 'Rajesh Shah',
                role: 'CMO, VibeDrink',
                text: "The visual identity they created for us is iconic. We consistently get asked who built our site.",
                rating: 5
            },
            {
                name: 'Amit Sharma',
                role: 'Founder, GearUp',
                text: "Professional, fast, and incredibly talented. The best investment we made this year.",
                rating: 5
            }
        ];
        defaultData.expertise = [
            {
                code: 'WEB',
                title: 'Development',
                desc: 'High-performance and responsive websites.',
                img: 'website.jpg'
            },
            {
                code: 'MOV',
                title: 'Ads',
                desc: 'Running Meta ads',
                img: 'metaad.jpg'
            }
        ];

        // Ensure directory exists
        const dir = path.dirname(DB_FILE);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2));
        console.log('Database initialized.');
    }
}

function getDB() {
    if (!fs.existsSync(DB_FILE)) initDB();
    return JSON.parse(fs.readFileSync(DB_FILE));
}

function saveDB(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Initialize on start
initDB();

// --- AUTH ROUTES ---

app.post('/api/auth/register', (req, res) => {
    const { username, password, secret } = req.body;

    if (secret !== ADMIN_SECRET) {
        return res.status(403).json({ error: 'Invalid admin secret key' });
    }

    if (!username || !username.includes('@')) {
        return res.status(400).json({ error: 'Invalid email address' });
    }

    const db = getDB();
    if (db.admins.find(u => u.username === username)) {
        return res.status(400).json({ error: 'Username already exists' });
    }

    db.admins.push({ username, password }); // In prod, hash this password!
    saveDB(db);

    res.json({ success: true, message: 'Admin registered successfully' });
});

app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    const db = getDB();

    const user = db.admins.find(u => u.username === username && u.password === password);

    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ success: true, token });
});

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        jwt.verify(bearerToken, SECRET_KEY, (err, authData) => {
            if (err) return res.sendStatus(403);
            req.authData = authData;
            next();
        });
    } else {
        res.sendStatus(403); // Forbidden
    }
}

// --- DATA ROUTES ---

// Projects
app.get('/api/projects', (req, res) => {
    const db = getDB();
    res.json(db.projects);
});

app.post('/api/projects', verifyToken, (req, res) => {
    const db = getDB();
    const newProject = req.body;
    db.projects.unshift(newProject);
    saveDB(db);
    res.json(db.projects);
});

app.delete('/api/projects/:index', verifyToken, (req, res) => {
    const db = getDB();
    const index = parseInt(req.params.index);
    if (index >= 0 && index < db.projects.length) {
        db.projects.splice(index, 1);
        saveDB(db);
    }
    res.json(db.projects);
});

// Reviews
app.get('/api/reviews', (req, res) => {
    const db = getDB();
    res.json(db.reviews);
});

app.post('/api/reviews', (req, res) => {
    // Public endpoint for submitting reviews
    const db = getDB();
    const newReview = req.body;
    db.reviews.unshift(newReview);
    saveDB(db);
    res.json(db.reviews);
});

app.delete('/api/reviews/:index', verifyToken, (req, res) => {
    const db = getDB();
    const index = parseInt(req.params.index);
    if (index >= 0 && index < db.reviews.length) {
        db.reviews.splice(index, 1);
        saveDB(db);
    }
    res.json(db.reviews);
});

// Expertise
app.get('/api/expertise', (req, res) => {
    const db = getDB();
    res.json(db.expertise);
});

app.post('/api/expertise', verifyToken, (req, res) => {
    const db = getDB();
    const newExpertise = req.body;
    db.expertise.push(newExpertise);
    saveDB(db);
    res.json(db.expertise);
});

app.delete('/api/expertise/:index', verifyToken, (req, res) => {
    const db = getDB();
    const index = parseInt(req.params.index);
    if (index >= 0 && index < db.expertise.length) {
        db.expertise.splice(index, 1);
        saveDB(db);
    }
    res.json(db.expertise);
});

// Contact
app.post('/api/contact', async (req, res) => {
    const db = getDB();
    const message = {
        id: Date.now(),
        ...req.body,
        date: new Date().toISOString()
    };

    // Fallback to local DB for storing messages
    if (!db.messages) db.messages = []; // Safety check for old DBs
    db.messages.unshift(message);
    saveDB(db);

    // Send email notification via Nodemailer
    if (transporter) {
        try {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: process.env.EMAIL_USER, // Send to the admin's email
                subject: `New Contact Request from ${message.name || 'Website User'}`,
                text: `You have received a new contact request:\n\nName: ${message.name}\nEmail: ${message.email}\nPhone: ${message.phone}\nMessage: ${message.message}\nDate: ${message.date}`,
            };
            await transporter.sendMail(mailOptions);
            console.log('Contact email sent successfully.');
        } catch (error) {
            console.error('Error sending contact email:', error);
        }
    }

    res.json({ success: true, message: 'Message received' });
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
