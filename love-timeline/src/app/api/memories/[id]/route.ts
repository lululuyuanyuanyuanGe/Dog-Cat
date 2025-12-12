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
          // Robust path extraction: Capture everything after 'LoveTimelineMedias/'
          const match = memory.media_url.match(/LoveTimelineMedias\/(.+)/);
          
          if (match && match[1]) {
              const filePath = decodeURIComponent(match[1]); 
              console.log(`Attempting to delete file: ${filePath}`);
              
              const { error: storageError } = await supabase.storage.from('LoveTimelineMedias').remove([filePath]);
              
              if (storageError) {
                  console.error("Storage delete error:", storageError);
                  return NextResponse.json({ error: `Storage delete failed: ${storageError.message}` }, { status: 500 });
              } else {
                  console.log("Storage file deleted successfully.");
              }
          } else {
              console.warn("Could not extract file path from URL:", memory.media_url);
              // If we can't parse the URL, we might choose to proceed or fail. 
              // Safer to proceed as it might be an external URL or legacy format.
          }
      } catch (err: any) {
          console.error("Failed to cleanup storage file:", err);
          return NextResponse.json({ error: `Storage cleanup exception: ${err.message}` }, { status: 500 });
      }
  }

  // 4. Delete Memory Record
  const { error } = await supabase.from('memories').delete().eq('id', id);

  if (error) {
    console.error("DB Delete Error:", error);
    return NextResponse.json({ error: error.message, details: error }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
