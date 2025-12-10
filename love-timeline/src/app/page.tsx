import { createSupabaseServerClient } from '@/lib/supabase/server';
import LoveTimeline from '@/components/LoveTimeline';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const supabase = await createSupabaseServerClient();

  // Parallel data fetching for performance
  const [memoriesRes, commentsRes] = await Promise.all([
    supabase.from('memories').select('*').order('date', { ascending: false }),
    supabase.from('comments').select('*').order('created_at', { ascending: true })
  ]);

  if (memoriesRes.error) {
    console.error("Error fetching memories:", memoriesRes.error);
  }
  
  if (commentsRes.error) {
    console.error("Error fetching comments:", commentsRes.error);
  }

  const memories = memoriesRes.data || [];
  const comments = commentsRes.data || [];

  return (
    <LoveTimeline 
      initialMemories={memories} 
      initialComments={comments} 
    />
  );
}
