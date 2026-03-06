import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

const DB_FILE = path.join(process.cwd(), 'data/db.json');

if (fs.existsSync(DB_FILE)) {
    const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));

    ['projects', 'reviews', 'expertise', 'messages'].forEach(collection => {
        if (db[collection]) {
            db[collection] = db[collection].map((item: any) => {
                if (!item.id) {
                    return { ...item, id: uuidv4() };
                }
                return item;
            });
        }
    });

    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
    console.log('Database sanitized: all items now have IDs.');
}
