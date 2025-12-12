import { createSupabaseServerClient } from '@/lib/supabase/server';
import LoveTimeline from '@/components/LoveTimeline';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const supabase = await createSupabaseServerClient();

  // Parallel data fetching: Memories, Comments, and Users (Partners)
  const [memoriesRes, commentsRes, usersRes] = await Promise.all([
    supabase.from('memories').select('*').order('date', { ascending: false }).order('created_at', { ascending: false }),
    supabase.from('comments').select('*').order('created_at', { ascending: true }),
    supabase.from('users').select('*')
  ]);

  if (memoriesRes.error) {
      console.error("Error fetching memories:", JSON.stringify(memoriesRes.error, null, 2));
      console.error("Status:", memoriesRes.status, memoriesRes.statusText);
  }
  if (commentsRes.error) console.error("Error fetching comments:", commentsRes.error);
  if (usersRes.error) console.error("Error fetching users:", usersRes.error);

  let memories = memoriesRes.data || [];
  const comments = commentsRes.data || [];
  const partners = usersRes.data || [];

  // Manual Join: Map users to memories
  const userMap = new Map(partners.map((p: any) => [p.id, p]));
  memories = memories.map((m: any) => ({
      ...m,
      users: userMap.get(m.user_id) || null
  }));

  return (
    <LoveTimeline 
      initialMemories={memories} 
      initialComments={comments} 
      partners={partners}
    />
  );
}