const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function uuidv4() {
    return crypto.randomUUID();
}

const DB_FILE = path.join(process.cwd(), 'data/db.json');

try {
    if (fs.existsSync(DB_FILE)) {
        const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));

        ['projects', 'reviews', 'expertise', 'messages'].forEach(collection => {
            if (db[collection]) {
                db[collection] = db[collection].map((item) => {
                    if (!item.id) {
                        return { ...item, id: uuidv4() };
                    }
                    return item;
                });
            }
        });

        fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
        console.log('Database sanitized successfully.');
    } else {
        console.log('DB_FILE not found at ' + DB_FILE);
    }
} catch (e) {
    console.error('Error during sanitization:', e);
}
