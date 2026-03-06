import { NextResponse } from 'next/server';
import { getLocalDB, saveLocalDB } from '@/lib/db';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const SECRET_KEY = process.env.SECRET_KEY || 'bb_fallback_secret_for_dev_only';

export async function POST(req: Request) {
    try {
        const { username, password } = await req.json();
        const db = getLocalDB();

        const user = db.admins.find((u: any) => u.username === username);
        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
        return NextResponse.json({ success: true, token });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
