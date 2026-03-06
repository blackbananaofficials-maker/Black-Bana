import { NextResponse } from 'next/server';
import { getCollection, supabase, getLocalDB, saveLocalDB } from '@/lib/db';
import { requireAuth, safeErrorResponse } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
    try {
        const data = await getCollection('projects');
        return NextResponse.json(data);
    } catch (error) {
        return safeErrorResponse(error);
    }
}

export async function POST(req: Request) {
    const authResult = requireAuth(req);
    if (authResult) return authResult.error;

    try {
        const body = await req.json();
        if (supabase) {
            const { data, error } = await supabase.from('projects').insert([body]).select();
            if (error) throw error;
            return NextResponse.json(data[0]);
        } else {
            const db = getLocalDB();
            const newItem = { ...body, id: uuidv4() };
            db.projects.unshift(newItem);
            saveLocalDB(db);
            return NextResponse.json(newItem);
        }
    } catch (error) {
        return safeErrorResponse(error);
    }
}
