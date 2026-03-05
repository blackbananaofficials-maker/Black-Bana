require('dotenv').config();
const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const helmet = require('helmet');
const xss = require('xss');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.SECRET_KEY || 'bb_fallback_secret_for_dev_only';
const ADMIN_SECRET = process.env.ADMIN_SECRET || '123123';
const SALT_ROUNDS = 10;

// --- CONFIGURATIONS ---

// 1. Supabase Initialization
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_KEY || '';
let supabase = null;

if (SUPABASE_URL && SUPABASE_KEY) {
    supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log('Supabase client initialized.');
} else {
    console.log('✅ Local JSON Database initialized successfully.');
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
app.use(helmet()); // Secure HTTP headers
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' })); // Reduced limit for safety
app.use(express.static(path.join(__dirname, '../'))); // Serve static files from root

// Database File Path
const DB_FILE = path.join(__dirname, '../data/db.json');

// --- DATABASE HELPERS ---

function initDB() {
    if (!fs.existsSync(DB_FILE)) {
        const defaultData = {
            admins: [
                {
                    username: 'admin@blackbanana.com',
                    password: bcrypt.hashSync('password123', SALT_ROUNDS) // Securing default admin
                }
            ],
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

app.post('/api/auth/register', async (req, res) => {
    const { username, password, secret } = req.body;

    if (secret !== ADMIN_SECRET) {
        return res.status(403).json({ error: 'Invalid admin secret key' });
    }

    if (!username || !username.includes('@')) {
        return res.status(400).json({ error: 'Invalid email address' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        if (supabase) {
            const { data: existingUser, error: selErr } = await supabase.from('admins').select('*').eq('username', username).maybeSingle();
            if (selErr) console.error("Supabase select error:", selErr);
            if (existingUser) return res.status(400).json({ error: 'Username already exists' });

            const { error } = await supabase.from('admins').insert([{ username, password: hashedPassword }]);
            if (error) return res.status(500).json({ error: 'Database error' });
        } else {
            const db = getDB();
            if (db.admins.find(u => u.username === username)) {
                return res.status(400).json({ error: 'Username already exists' });
            }
            db.admins.push({ username, password: hashedPassword });
            saveDB(db);
        }

        res.json({ success: true, message: 'Admin registered successfully' });
    } catch (err) {
        console.error("Auth register error:", err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
    let user = null;

    try {
        if (supabase) {
            const { data, error: selErr } = await supabase.from('admins').select('*').eq('username', username).maybeSingle();
            if (selErr) console.error("Supabase select error:", selErr);
            user = data;
        } else {
            const db = getDB();
            user = db.admins.find(u => u.username === username);
        }

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ success: true, token });
    } catch (err) {
        console.error("Auth login error:", err);
        res.status(500).json({ error: 'Internal server error' });
    }
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
app.get('/api/projects', async (req, res) => {
    if (supabase) {
        const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
        if (error) return res.status(500).json({ error: error.message });
        return res.json(data);
    }
    const db = getDB();
    res.json(db.projects);
});

app.post('/api/projects', verifyToken, async (req, res) => {
    const newProject = req.body;
    if (supabase) {
        const { error } = await supabase.from('projects').insert([newProject]);
        if (error) return res.status(500).json({ error: 'Error adding project' });
        const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
        return res.json(data);
    }
    const db = getDB();
    if (!newProject.id) newProject.id = Date.now().toString();
    db.projects.unshift(newProject);
    saveDB(db);
    res.json(db.projects);
});

app.delete('/api/projects/:id', verifyToken, async (req, res) => {
    if (supabase) {
        const { error } = await supabase.from('projects').delete().eq('id', req.params.id);
        if (error) return res.status(500).json({ error: 'Error deleting project' });
        const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
        return res.json(data);
    }
    const db = getDB();
    const id = req.params.id;
    const index = db.projects.findIndex(p => (p.id && p.id.toString() === id.toString()) || db.projects.indexOf(p).toString() === id.toString());
    if (index !== -1) {
        db.projects.splice(index, 1);
        saveDB(db);
    }
    res.json(db.projects);
});

// Reviews
app.get('/api/reviews', async (req, res) => {
    if (supabase) {
        const { data, error } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
        if (error) return res.status(500).json({ error: error.message });
        return res.json(data);
    }
    const db = getDB();
    res.json(db.reviews);
});

app.post('/api/reviews', async (req, res) => {
    const { name, role, text, rating, email } = req.body;

    // Sanitize user input for XSS
    const newReview = {
        name: xss(name),
        role: xss(role),
        text: xss(text),
        rating: parseInt(rating) || 5,
        email: xss(email),
        is_featured: false
    };

    if (supabase) {
        const { error } = await supabase.from('reviews').insert([newReview]);
        if (error) return res.status(500).json({ error: 'Error saving review' });
        const { data } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
        return res.json(data);
    }
    const db = getDB();
    newReview.id = Date.now().toString(); // Consistent IDs
    db.reviews.unshift(newReview);
    saveDB(db);
    res.json(db.reviews);
});

app.put('/api/reviews/:id/feature', verifyToken, async (req, res) => {
    const { is_featured } = req.body;
    const { id } = req.params;

    if (supabase) {
        const { error } = await supabase.from('reviews').update({ is_featured }).eq('id', id);
        if (error) return res.status(500).json({ error: 'Error updating review' });
        const { data } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
        return res.json(data);
    }

    const db = getDB();
    const index = db.reviews.findIndex(r => (r.id && r.id.toString() === id.toString()) || db.reviews.indexOf(r).toString() === id.toString());
    if (index !== -1) {
        db.reviews[index].is_featured = is_featured;
        saveDB(db);
    }
    res.json(db.reviews);
});

app.delete('/api/reviews/:id', verifyToken, async (req, res) => {
    if (supabase) {
        const { error } = await supabase.from('reviews').delete().eq('id', req.params.id);
        if (error) return res.status(500).json({ error: 'Error deleting review' });
        const { data } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
        return res.json(data);
    }
    const db = getDB();
    const id = req.params.id;
    const index = db.reviews.findIndex(r => (r.id && r.id.toString() === id.toString()) || db.reviews.indexOf(r).toString() === id.toString());
    if (index !== -1) {
        db.reviews.splice(index, 1);
        saveDB(db);
    }
    res.json(db.reviews);
});

// Expertise
app.get('/api/expertise', async (req, res) => {
    if (supabase) {
        const { data, error } = await supabase.from('expertise').select('*').order('created_at', { ascending: true });
        if (error) return res.status(500).json({ error: error.message });
        return res.json(data);
    }
    const db = getDB();
    res.json(db.expertise);
});

app.post('/api/expertise', verifyToken, async (req, res) => {
    const newExpertise = req.body;
    if (supabase) {
        const { error } = await supabase.from('expertise').insert([newExpertise]);
        if (error) return res.status(500).json({ error: 'Error adding service' });
        const { data } = await supabase.from('expertise').select('*').order('created_at', { ascending: true });
        return res.json(data);
    }
    const db = getDB();
    if (!newExpertise.id) newExpertise.id = Date.now().toString();
    db.expertise.push(newExpertise);
    saveDB(db);
    res.json(db.expertise);
});

app.delete('/api/expertise/:id', verifyToken, async (req, res) => {
    if (supabase) {
        const { error } = await supabase.from('expertise').delete().eq('id', req.params.id);
        if (error) return res.status(500).json({ error: 'Error deleting service' });
        const { data } = await supabase.from('expertise').select('*').order('created_at', { ascending: true });
        return res.json(data);
    }
    const db = getDB();
    const id = req.params.id;
    const index = db.expertise.findIndex(e => (e.id && e.id.toString() === id.toString()) || db.expertise.indexOf(e).toString() === id.toString());
    if (index !== -1) {
        db.expertise.splice(index, 1);
        saveDB(db);
    }
    res.json(db.expertise);
});

// Contact
app.post('/api/contact', async (req, res) => {
    const { name, email, company, message } = req.body;

    const messageInfo = {
        name: xss(name),
        email: xss(email),
        company: xss(company),
        message: xss(message)
    };

    if (supabase) {
        const { error } = await supabase.from('messages').insert([messageInfo]);
        if (error) console.error('Supabase insert error', error);
    } else {
        const msg = {
            id: Date.now().toString(),
            ...messageInfo,
            date: new Date().toISOString()
        };
        const db = getDB();
        if (!db.messages) db.messages = [];
        db.messages.unshift(msg);
        saveDB(db);
    }

    // Send email notification via Nodemailer
    if (transporter) {
        try {
            const mailOptions = {
                from: `"Black Banana Website" <${process.env.EMAIL_USER}>`,
                to: process.env.EMAIL_USER,
                replyTo: messageInfo.email,
                subject: `🔥 NEW LEAD: ${messageInfo.name} from ${messageInfo.company || 'Direct'}`,
                html: `
                    <div style="font-family: sans-serif; color: #333; max-width: 600px; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
                        <h2 style="color: #F59E0B; text-transform: uppercase;">New Contact Request</h2>
                        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                        <p><strong>Name:</strong> ${messageInfo.name}</p>
                        <p><strong>Email:</strong> ${messageInfo.email}</p>
                        <p><strong>Company:</strong> ${messageInfo.company || 'Not provided'}</p>
                        <p><strong>Message:</strong></p>
                        <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; font-style: italic;">
                            "${messageInfo.message}"
                        </div>
                        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                        <p style="font-size: 12px; color: #999;">This email was sent from the Black Banana digital empire contact form.</p>
                    </div>
                `,
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
