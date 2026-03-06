import { NextResponse } from 'next/server';
import { getCollection, supabase, getLocalDB, saveLocalDB } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
    try {
        const data = await getCollection('companies');
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { name } = await req.json();
        if (supabase) {
            const { error } = await supabase.from('companies').insert([{ name }]);
            if (error) throw error;
            return NextResponse.json({ success: true, name });
        } else {
            const db = getLocalDB();
            if (!db.companies) db.companies = [];
            db.companies.push(name);
            saveLocalDB(db);
            return NextResponse.json({ success: true, name });
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { name } = await req.json();
        if (supabase) {
            const { error } = await supabase.from('companies').delete().eq('name', name);
            if (error) throw error;
            return NextResponse.json({ success: true });
        } else {
            const db = getLocalDB();
            db.companies = db.companies.filter((c: string) => c !== name);
            saveLocalDB(db);
            return NextResponse.json({ success: true });
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
