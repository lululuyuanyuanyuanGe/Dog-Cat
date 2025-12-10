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

    // 2. Verify Admin Role
    // We query the 'users' table to check the role of the current user
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (profileError || userProfile?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: Only admins can add memories.' },
        { status: 403 }
      );
    }

    // 3. Parse Request Data
    const body = await request.json();
    const { date, type, content, media_url, metadata } = body;

    // Basic validation
    if (!date || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: date or type' },
        { status: 400 }
      );
    }

    // 4. Insert Memory
    const { data, error } = await supabase
      .from('memories')
      .insert({
        user_id: session.user.id,
        date,
        type,
        content,
        media_url,
        metadata: metadata || {},
      })
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
