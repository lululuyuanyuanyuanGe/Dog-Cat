import { createSupabaseServerClient } from '@/lib/supabase/server';
import LoveTimeline from '@/components/LoveTimeline';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const supabase = await createSupabaseServerClient();

  // Parallel data fetching: Memories, Comments, and Users (Partners)
  const [memoriesRes, commentsRes, usersRes] = await Promise.all([
    supabase.from('memories').select('*, users(display_name, avatar_url)').order('date', { ascending: false }).order('created_at', { ascending: false }),
    supabase.from('comments').select('*').order('created_at', { ascending: true }),
    supabase.from('users').select('*').limit(2) // Get first two users
  ]);

  if (memoriesRes.error) console.error("Error fetching memories:", memoriesRes.error);
  if (commentsRes.error) console.error("Error fetching comments:", commentsRes.error);
  if (usersRes.error) console.error("Error fetching users:", usersRes.error);

  const memories = memoriesRes.data || [];
  const comments = commentsRes.data || [];
  const partners = usersRes.data || [];

  return (
    <LoveTimeline 
      initialMemories={memories} 
      initialComments={comments} 
      partners={partners}
    />
  );
}