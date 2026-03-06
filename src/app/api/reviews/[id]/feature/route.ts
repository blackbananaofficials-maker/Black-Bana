import { NextResponse } from 'next/server';
import { getLocalDB, saveLocalDB, supabase } from '@/lib/db';

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { is_featured } = await req.json();

        if (supabase) {
            const { error } = await supabase.from('reviews').update({ is_featured }).eq('id', id);
            if (error) throw error;
        } else {
            const db = getLocalDB();
            const index = db.reviews.findIndex((r: any) => r.id === id);
            if (index !== -1) {
                db.reviews[index].is_featured = is_featured;
                saveLocalDB(db);
            }
        }
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
