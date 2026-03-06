import { NextResponse } from 'next/server';
import { getCollection, supabase, getLocalDB } from '@/lib/db';
import { safeErrorResponse } from '@/lib/auth';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const SECRET_KEY = process.env.SECRET_KEY || 'bb_fallback_secret_for_dev_only';

export async function POST(req: Request) {
    try {
        const { username, password } = await req.json();

        if (!username || !password) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        let user: any = null;

        // 1. Try Supabase admins first
        if (supabase) {
            const { data, error } = await supabase
                .from('admins')
                .select('username, password')
                .eq('username', username)
                .maybeSingle();
            if (!error && data) user = data;
        }

        // 2. Fall back to local DB if not found in Supabase
        if (!user) {
            const db = getLocalDB();
            user = db.admins?.find((u: any) => u.username === username) ?? null;
        }

        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Support both bcrypt-hashed and plaintext passwords (local dev safeguard)
        const stored: string = user.password ?? '';
        const isHashed = stored.startsWith('$2');
        const isMatch = isHashed
            ? await bcrypt.compare(password, stored)
            : password === stored; // plaintext fallback for legacy dev accounts only

        if (!isMatch) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '8h' });
        return NextResponse.json({ success: true, token });
    } catch (error) {
        return safeErrorResponse(error);
    }
}
