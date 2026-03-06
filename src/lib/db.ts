import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Supabase config
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_KEY || '';

export const supabase = (SUPABASE_URL && SUPABASE_KEY)
    ? createClient(SUPABASE_URL, SUPABASE_KEY)
    : null;

// Local DB config
const DB_FILE = path.join(process.cwd(), 'data/db.json');

export function getLocalDB() {
    if (!fs.existsSync(DB_FILE)) {
        // Initialize if doesn't exist (copying from server.js logic)
        const dir = path.dirname(DB_FILE);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

        const defaultData = {
            admins: [],
            projects: [],
            reviews: [],
            expertise: [],
            messages: [],
            companies: ["Edverb", "Pixy", "Caspera", "Anchor.mitul", "Shreenathji investments", "Begum’s Pride"],
            methods: []
        };
        fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2));
        return defaultData;
    }
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}

export function saveLocalDB(data: any) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

export async function getCollection(name: 'projects' | 'reviews' | 'expertise' | 'admins' | 'messages' | 'companies' | 'methods') {
    if (supabase) {
        try {
            const { data, error } = await supabase.from(name).select('*');
            if (error) throw error;
            return data;
        } catch (err) {
            console.warn(`Supabase fetch failed for ${name}, falling back to local DB:`, err);
        }
    }
    const db = getLocalDB();
    const collection = db[name] || [];

    // Extra resilience for missing IDs in JSON
    let modified = false;
    const sanitized = collection.map((item: any) => {
        if (typeof item === 'object' && item !== null) {
            if (!item.id) {
                modified = true;
                return { ...item, id: require('crypto').randomUUID() };
            }
            return item;
        }
        return item; // Keep strings as is
    });

    if (modified) {
        db[name] = sanitized;
        saveLocalDB(db);
    }

    return sanitized;
}
