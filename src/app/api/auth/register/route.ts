import { NextResponse } from 'next/server';
import { getLocalDB, saveLocalDB } from '@/lib/db';
import bcrypt from 'bcryptjs';

const ADMIN_SECRET = process.env.ADMIN_SECRET || '123123';

export async function POST(req: Request) {
    try {
        const { username, password, secret } = await req.json();

        if (secret !== ADMIN_SECRET) {
            return NextResponse.json({ error: 'Invalid admin secret key' }, { status: 403 });
        }

        const db = getLocalDB();
        if (db.admins.find((u: any) => u.username === username)) {
            return NextResponse.json({ error: 'Username already exists' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        db.admins.push({ username, password: hashedPassword });
        saveLocalDB(db);

        return NextResponse.json({ success: true, message: 'Admin registered successfully' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
