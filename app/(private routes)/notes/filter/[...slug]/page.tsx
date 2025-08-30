'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { checkSession } from '@/lib/api/clientApi';
import NotesClient from './Notes.client';
import type { NoteTag } from '@/types/note';

type ProtectedNotesProps = {
  initialTag: 'All' | NoteTag;
};

// Экспортируем сам компонент по умолчанию, а не тип
export default function ProtectedNotes({ initialTag }: ProtectedNotesProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const verifySession = async () => {
      try {
        const valid = await checkSession();
        if (isMounted) {
          if (!valid) {
            router.push('/sign-in'); // редирект на страницу входа
          } else {
            setAuthenticated(true);
          }
        }
      } catch {
        router.push('/sign-in');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    verifySession();

    return () => {
      isMounted = false;
    };
  }, [router]);

  if (loading) return <div>Loading...</div>;
  if (!authenticated) return null;

  return <NotesClient initialTag={initialTag} />;
}
