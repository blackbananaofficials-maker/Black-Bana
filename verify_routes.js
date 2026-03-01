const http = require('http');

function request(options, data) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, body: JSON.parse(body) });
                } catch (e) {
                    resolve({ status: res.statusCode, body });
                }
            });
        });
        req.on('error', reject);
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
}

async function verify() {
    console.log('--- STARTING VERIFICATION ---');

    // 1. Register/Login Admin to get Token
    console.log('\n1. Authenticating...');
    let token = '';
    try {
        // Try login first
        let res = await request({
            hostname: 'localhost', port: 3000, path: '/api/auth/login', method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, { username: 'admin@bb.com', password: 'password' });

        if (res.status !== 200) {
            // Try register if login fails (first run)
            console.log('Login failed, trying register...');
            res = await request({
                hostname: 'localhost', port: 3000, path: '/api/auth/register', method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            }, { username: 'admin@bb.com', password: 'password', secret: '123123' });

            if (res.status === 200) {
                // Login again
                res = await request({
                    hostname: 'localhost', port: 3000, path: '/api/auth/login', method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                }, { username: 'admin@bb.com', password: 'password' });
            }
        }

        if (res.status === 200 && res.body.token) {
            token = res.body.token;
            console.log('✓ Authenticated');
        } else {
            console.error('✗ Authentication Failed', res.body);
            process.exit(1);
        }
    } catch (e) { console.error(e); process.exit(1); }

    const authHeader = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

    // 2. Add Expertise
    console.log('\n2. Testing POST /api/expertise...');
    const newExp = { title: 'Test Service', desc: 'Testing...', code: '99', icon: 'svg...' };
    let res = await request({
        hostname: 'localhost', port: 3000, path: '/api/expertise', method: 'POST',
        headers: authHeader
    }, newExp);

    if (res.status === 200 && res.body.find(e => e.title === 'Test Service')) {
        console.log('✓ Expertise Added');
    } else {
        console.error('✗ Failed to add expertise', res.body);
    }

    // 3. Delete Expertise (Cleanup)
    console.log('\n3. Testing DELETE /api/expertise...');
    // Find index
    const list = res.body;
    const idx = list.findIndex(e => e.title === 'Test Service');
    if (idx !== -1) {
        res = await request({
            hostname: 'localhost', port: 3000, path: `/api/expertise/${idx}`, method: 'DELETE',
            headers: authHeader
        });
        if (res.status === 200 && !res.body.find(e => e.title === 'Test Service')) {
            console.log('✓ Expertise Deleted');
        } else {
            console.error('✗ Failed to delete expertise', res.body);
        }
    }

    // 4. Contact Form
    console.log('\n4. Testing POST /api/contact...');
    res = await request({
        hostname: 'localhost', port: 3000, path: '/api/contact', method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }, { name: 'Test User', email: 'test@user.com', message: 'Hello World' });

    if (res.status === 200 && res.body.success) {
        console.log('✓ Contact Message Sent');
    } else {
        console.error('✗ Contact Failed', res.body);
    }

    console.log('\n--- VERIFICATION COMPLETE ---');
}

verify();
