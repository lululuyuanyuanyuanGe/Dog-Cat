import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;
  
  const supabase = await createSupabaseServerClient();

  // 1. Verify Authentication
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Fetch memory to get media_url
  const { data: memory, error: fetchError } = await supabase
    .from('memories')
    .select('media_url, user_id')
    .eq('id', id)
    .single();

  if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  // 3. Delete from Storage if exists
  if (memory.media_url) {
      try {
          // Extract path from URL: .../LoveTimelineMedias/photos/filename.jpg
          // We need 'photos/filename.jpg'
          const urlParts = memory.media_url.split('/LoveTimelineMedias/');
          if (urlParts.length > 1) {
              const filePath = urlParts[1];
              await supabase.storage.from('LoveTimelineMedias').remove([filePath]);
          }
      } catch (err) {
          console.error("Failed to cleanup storage file:", err);
          // Continue to delete DB record even if storage cleanup fails
      }
  }

  // 4. Delete Memory Record
  const { error } = await supabase.from('memories').delete().eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
