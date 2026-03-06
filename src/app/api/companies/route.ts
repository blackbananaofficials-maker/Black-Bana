import { NextResponse } from 'next/server';
import { getCollection, supabase, getLocalDB, saveLocalDB } from '@/lib/db';
import { requireAuth, safeErrorResponse } from '@/lib/auth';

export async function GET() {
    try {
        const data = await getCollection('companies');
        return NextResponse.json(data);
    } catch (error) {
        return safeErrorResponse(error);
    }
}

export async function POST(req: Request) {
    const authResult = requireAuth(req);
    if (authResult) return authResult.error;

    try {
        const { name } = await req.json();
        if (!name || typeof name !== 'string') {
            return NextResponse.json({ error: 'Company name is required.' }, { status: 400 });
        }
        const safeName = name.trim().slice(0, 100);
        if (supabase) {
            const { error } = await supabase.from('companies').insert([{ name: safeName }]);
            if (error) throw error;
        } else {
            const db = getLocalDB();
            if (!db.companies) db.companies = [];
            db.companies.push(safeName);
            saveLocalDB(db);
        }
        return NextResponse.json({ success: true, name: safeName });
    } catch (error) {
        return safeErrorResponse(error);
    }
}

export async function DELETE(req: Request) {
    const authResult = requireAuth(req);
    if (authResult) return authResult.error;

    try {
        const { name } = await req.json();
        if (supabase) {
            const { error } = await supabase.from('companies').delete().eq('name', name);
            if (error) throw error;
        } else {
            const db = getLocalDB();
            db.companies = db.companies.filter((c: string) => c !== name);
            saveLocalDB(db);
        }
        return NextResponse.json({ success: true });
    } catch (error) {
        return safeErrorResponse(error);
    }
}
