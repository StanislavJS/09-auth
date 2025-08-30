// app/(private routes)/notes/filter/[...slug]/page.tsx
import { HydrationBoundary, dehydrate, QueryClient } from '@tanstack/react-query';
import { fetchServerNotes, checkServerSession } from '@/lib/api/serverApi';
import NotesClient from './Notes.client';
import type { NoteTag, NotesResponse } from '@/types/note';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

type Props = {
  params: Promise<{ slug?: string[] }>;
};

// 🔹 Хелпер для обработки тегов
function parseTag(slug?: string[]): NoteTag | 'All' {
  const raw = slug?.[0];
  if (!raw || raw.toLowerCase() === 'all') return 'All';
  return raw as NoteTag;
}

// ✅ SEO metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const tag = parseTag(resolvedParams.slug);

  const title = `Notes — ${tag} | NoteHub`;
  const description = `Browse your notes filtered by: ${tag}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/notes/filter/${tag}`,
      images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
    },
  };
}

// ✅ Страница заметок с фильтром и защитой
export default async function NotesFilterPage({ params }: Props) {
  const resolvedParams = await params;
  const tag = parseTag(resolvedParams.slug);
  
  // 🔹 Проверка сессии (защита страницы)
  const session = await checkServerSession();
  if (!session) redirect('/sign-in');

  // 🔹 Получение начальных заметок через SSR
  // Получение начальных заметок через SSR
let initialNotes: NotesResponse;
try {
  const fetchResult = await fetchServerNotes({
    page: 1,
    perPage: 12,
    search: '',
    tag: tag === 'All' ? undefined : tag,
  });

  // Преобразуем FetchNotesResponse в NotesResponse
  initialNotes = {
    notes: fetchResult.data ?? [],
    totalPages: Math.ceil((fetchResult.total ?? 0) / 12) || 1,
  };
} catch {
  initialNotes = {
    notes: [],
    totalPages: 1,
  };
}


  // 🔹 TanStack Query prefetch
  const queryClient = new QueryClient();
  queryClient.setQueryData(['notes', 1, '', tag], initialNotes);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient initialNotes={initialNotes} initialTag={tag} />
    </HydrationBoundary>
  );
}
