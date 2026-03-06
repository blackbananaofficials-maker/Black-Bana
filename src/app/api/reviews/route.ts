import { NextResponse } from 'next/server';
import { getCollection, supabase, getLocalDB, saveLocalDB } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
    try {
        const data = await getCollection('reviews');
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const newReview = {
            ...body,
            is_featured: body.is_featured || false,
            rating: parseInt(body.rating) || 5
        };

        if (supabase) {
            const { data, error } = await supabase.from('reviews').insert([newReview]).select();
            if (error) throw error;
            return NextResponse.json(data[0]);
        } else {
            const db = getLocalDB();
            const newItem = { ...newReview, id: uuidv4() };
            db.reviews.unshift(newItem);
            saveLocalDB(db);
            return NextResponse.json(newItem);
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
