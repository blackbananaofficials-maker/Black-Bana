require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function test() {
    try {
        console.log("Testing projects...");
        const { data: projects, error: pErr } = await supabase.from('projects').select('*');
        if (pErr) {
            fs.writeFileSync('db_error.json', JSON.stringify(pErr, Object.getOwnPropertyNames(pErr), 2));
            console.log("Wrote error to db_error.json");
        } else {
            console.log("Projects Count:", projects.length);
        }
    } catch (e) {
        fs.writeFileSync('db_error.json', JSON.stringify({ message: e.message, stack: e.stack }, null, 2));
        console.log("Wrote exception to db_error.json");
    }
}

test();
