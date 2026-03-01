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
    console.log('--- STARTING AUTH VERIFICATION ---');

    // 1. Test Hardcoded Login
    console.log('\n1. Testing Default Login (admin@blackbanana.com)...');
    try {
        let res = await request({
            hostname: 'localhost', port: 3000, path: '/api/auth/login', method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, { username: 'admin@blackbanana.com', password: 'password123' });

        if (res.status === 200 && res.body.token) {
            console.log('✓ Login Successful');
        } else {
            console.error('✗ Login Failed', res.body);
        }
    } catch (e) { console.error(e); }

    // 2. Test Registration (New User)
    console.log('\n2. Testing Registration (newuser@test.com)...');
    try {
        let res = await request({
            hostname: 'localhost', port: 3000, path: '/api/auth/register', method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, { username: 'newuser@test.com', password: 'password123', secret: '123123' });

        if (res.status === 200) {
            console.log('✓ Registration Successful');

            // Login with new user
            res = await request({
                hostname: 'localhost', port: 3000, path: '/api/auth/login', method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            }, { username: 'newuser@test.com', password: 'password123' });

            if (res.status === 200 && res.body.token) {
                console.log('✓ Login with New User Successful');
            } else {
                console.error('✗ Login with New User Failed', res.body);
            }

        } else if (res.status === 400 && res.body.error === 'Username already exists') {
            console.log('✓ User already exists (Previous run success)');
        } else {
            console.error('✗ Registration Failed', res.body);
        }
    } catch (e) { console.error(e); }

    // 3. Test Invalid Secret
    console.log('\n3. Testing Invalid Secret...');
    try {
        let res = await request({
            hostname: 'localhost', port: 3000, path: '/api/auth/register', method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, { username: 'hacker@test.com', password: 'password123', secret: 'WRONG_SECRET' });

        if (res.status === 403) {
            console.log('✓ Registration Blocked (Correct Behavior)');
        } else {
            console.error('✗ Registration Should Have Failed', res.status);
        }
    } catch (e) { console.error(e); }

    console.log('\n--- VERIFICATION COMPLETE ---');
}

verify();
