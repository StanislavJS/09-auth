// app/(private routes)/notes/[id]/page.tsx
import NotePreview from '../../../@modal/(.)notes/[id]/NotePreview.client';
import { fetchNoteById } from '@/lib/api/clientApi';
import { QueryClient, HydrationBoundary, dehydrate } from '@tanstack/react-query';
import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-vercel-domain.vercel.app';

interface NotePageProps {
  params: Promise<{ id: string }>;
}

// Хелпер для получения заметки
async function getNoteById(id: string) {
  const note = await fetchNoteById(id);
  return note;
}

// Динамические метаданные
export async function generateMetadata({ params }: NotePageProps): Promise<Metadata> {
  const { id } = await params;
  const note = await getNoteById(id);

  return {
    title: `${note.title} | NoteHub`,
    description: note.content?.slice(0, 150) || 'Preview note in NoteHub.',
    openGraph: {
      title: `${note.title} | NoteHub`,
      description: note.content?.slice(0, 150) || 'Preview note in NoteHub.',
      url: `${SITE_URL}/notes/${id}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: 'NoteHub Note Preview OG Image',
        },
      ],
    },
  };
}

// Server Component страницы заметки
export default async function NotePreviewPage({ params }: NotePageProps) {
  const { id } = await params;
  const note = await getNoteById(id);

  const queryClient = new QueryClient();
  queryClient.setQueryData(['note', id], note);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotePreview noteId={id} />
    </HydrationBoundary>
  );
}
