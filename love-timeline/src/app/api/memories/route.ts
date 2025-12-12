import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();

    // 1. Verify Authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // REMOVED: Role check. 
    // In the new schema, any authenticated user is considered a "partner" and can add memories.

    // 2. Parse Request Data
    const body = await request.json();

    // 3. Handle Batch vs Single Insert
    let insertPayload;
    
    if (Array.isArray(body)) {
        // Batch Mode
        insertPayload = body.map(item => ({
            user_id: user.id,
            date: item.date,
            type: item.type,
            content: item.content,
            media_url: item.media_url,
            metadata: item.metadata || {},
        }));
    } else {
        // Single Mode
        const { date, type, content, media_url, metadata } = body;
        
        if (!date || !type) {
            return NextResponse.json(
                { error: 'Missing required fields: date or type' },
                { status: 400 }
            );
        }

        insertPayload = [{
            user_id: user.id,
            date,
            type,
            content,
            media_url,
            metadata: metadata || {},
        }];
    }

    // 4. Execute Insert
    const { data, error } = await supabase
      .from('memories')
      .insert(insertPayload as any)
      .select();

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