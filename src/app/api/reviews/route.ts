import { NextResponse } from 'next/server';
import { getCollection, supabase, getLocalDB, saveLocalDB } from '@/lib/db';
import { requireAuth, safeErrorResponse } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
    try {
        const data = await getCollection('reviews');
        return NextResponse.json(data);
    } catch (error) {
        return safeErrorResponse(error);
    }
}

export async function POST(req: Request) {
    // Public: anyone can submit a review (no auth required for submission)
    try {
        const body = await req.json();
        // Basic input validation
        if (!body.name || !body.text) {
            return NextResponse.json({ error: 'Name and review text are required.' }, { status: 400 });
        }
        const newReview = {
            name: String(body.name).slice(0, 100),
            role: String(body.role || '').slice(0, 100),
            email: String(body.email || '').slice(0, 200),
            text: String(body.text).slice(0, 1000),
            rating: Math.min(5, Math.max(1, parseInt(body.rating) || 5)),
            is_featured: false, // always start unfeatured
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
    } catch (error) {
        return safeErrorResponse(error);
    }
}
