import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const { memory_date, author_name, content } = await request.json();

    // Validate input
    if (!memory_date || !author_name || !content) {
        return new NextResponse(JSON.stringify({ error: 'Missing required fields: memory_date, author_name, content' }), { status: 400 });
    }

    const supabase = await createSupabaseServerClient();

    // Create a random avatar seed for consistent guest avatars
    const avatar_seed = (author_name || 'G').charAt(0).toUpperCase();

    const { data, error } = await supabase
        .from('comments')
        .insert({
            memory_date,
            author_name,
            content,
            avatar_seed,
        })
        .select()
        .single();

    if (error) {
        console.error('Error inserting comment:', error);
        return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return NextResponse.json(data);
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!date) {
        return new NextResponse(JSON.stringify({ error: 'Missing date parameter' }), { status: 400 });
    }

    const supabase = await createSupabaseServerClient();

    // Check auth
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const { error } = await supabase
        .from('comments')
        .delete()
        .eq('memory_date', date);

    if (error) {
        console.error('Error deleting comments for date:', error);
        return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return NextResponse.json({ success: true });
}
