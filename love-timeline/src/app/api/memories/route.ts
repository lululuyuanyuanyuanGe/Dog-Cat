import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();

    // 1. Verify Authentication
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // REMOVED: Role check. 
    // In the new schema, any authenticated user is considered a "partner" and can add memories.

    // 2. Parse Request Data
    const body = await request.json();
    const { date, type, content, media_url, metadata } = body;

    // Basic validation
    if (!date || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: date or type' },
        { status: 400 }
      );
    }

    // 3. Insert Memory
    const { data, error } = await supabase
      .from('memories')
      .insert({
        user_id: session.user.id,
        date,
        type,
        content,
        media_url,
        metadata: metadata || {},
      } as any)
      .select()
      .single();

    if (error) {
      console.error('Supabase Insert Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    console.error('Unexpected Error:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}