// serverApi.ts
import { cookies } from 'next/headers';
import { api } from './api';
import { Note } from '@/types/note';
import { User } from '@/types/user';
import type { FetchNotesParams } from './clientApi';

// Перевірка сесії, повертаємо User | null
export const checkServerSession = async (): Promise<User | null> => {
  try {
    const cookieStore = await cookies();
    const res = await api.get<{ success: boolean; user?: User }>('/auth/session', {
      headers: { Cookie: cookieStore.toString() },
    });
    return res.data.success && res.data.user ? res.data.user : null;
  } catch {
    return null;
  }
};

// Повертаємо користувача
export const getServerMe = async (): Promise<User | null> => {
  try {
    const cookieStore = await cookies();
    const { data } = await api.get<User>('/users/me', {
      headers: { Cookie: cookieStore.toString() },
    });
    return data;
  } catch {
    return null;
  }
};

// Повертаємо NotesResponse { notes, totalPages }
export const fetchServerNotes = async (params: FetchNotesParams = {}) => {
  try {
    const cookieStore = await cookies();
    const { page = 1, perPage = 12, search = '', tag } = params;

    const response = await api.get<{ notes: Note[]; totalPages: number }>('/notes', {
      params: { page, perPage, ...(search && { search }), ...(tag && { tag }) },
      headers: { Cookie: cookieStore.toString() },
    });

    return {
      notes: response.data.notes,
      totalPages: response.data.totalPages,
      page,
      perPage,
    };
  } catch {
    return { notes: [], totalPages: 0, page: 1, perPage: 12 };
  }
};

// Повертаємо одну нотатку
export const fetchServerNoteById = async (id: string): Promise<Note | null> => {
  try {
    const cookieStore = await cookies();
    const res = await api.get<Note>(`/notes/${id}`, {
      headers: { Cookie: cookieStore.toString() },
    });
    return res.data;
  } catch {
    return null;
  }
};
