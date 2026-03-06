import { NextResponse } from 'next/server';
import { getLocalDB, saveLocalDB, supabase } from '@/lib/db';

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        if (supabase) {
            const { error } = await supabase.from('reviews').delete().eq('id', id);
            if (error) throw error;
        } else {
            const db = getLocalDB();
            db.reviews = db.reviews.filter((r: any) => r.id !== id);
            saveLocalDB(db);
        }
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
