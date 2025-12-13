import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { ids } = await request.json();
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'Invalid IDs provided' }, { status: 400 });
    }

    console.log(`[Batch Delete] Starting deletion for ${ids.length} memories...`);

    // 1. Fetch memories to get media_urls for storage cleanup
    const { data: memories, error: fetchError } = await supabase
      .from('memories')
      .select('id, media_url')
      .in('id', ids);

    if (fetchError) throw fetchError;

    // 2. Storage Cleanup (Robust)
    const filesToDelete: string[] = [];
    memories?.forEach((memory: any) => {
      if (memory.media_url) {
        // Robust regex to extract path
        const match = memory.media_url.match(/LoveTimelineMedias\/(.+)/);
        if (match && match[1]) {
          filesToDelete.push(decodeURIComponent(match[1]));
        }
      }
    });

    if (filesToDelete.length > 0) {
      console.log(`[Batch Delete] Removing ${filesToDelete.length} files from storage...`);
      // Supabase storage.remove accepts an array of paths!
      const { error: storageError } = await supabase.storage
        .from('LoveTimelineMedias')
        .remove(filesToDelete);

      if (storageError) {
        console.error("[Batch Delete] Storage error:", storageError);
        // We throw here to prevent DB deletion if storage fails (consistency)
        throw new Error(`Storage delete failed: ${storageError.message}`);
      }
      console.log("[Batch Delete] Storage cleanup successful.");
    }

    // 3. Database Delete
    console.log(`[Batch Delete] Removing records from DB...`);
    const { error: dbError } = await supabase
      .from('memories')
      .delete()
      .in('id', ids);

    if (dbError) throw dbError;

    console.log(`[Batch Delete] Successfully deleted ${ids.length} memories.`);
    return NextResponse.json({ success: true, count: ids.length });

  } catch (error: any) {
    console.error("[Batch Delete] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
