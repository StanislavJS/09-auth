import { cookies } from 'next/headers';
import { api } from './api';
import { Note } from '@/types/note';
import { User } from '@/types/user';
import { FetchNotesParams, FetchNotesResponse } from './clientApi';

export const checkServerSession = async (): Promise<boolean> => {
  try {
    const cookieStore = await cookies();
    const res = await api.get('/auth/session', {
      headers: { Cookie: cookieStore.toString() },
    });
    return res.data.success;
  } catch {
    return false;
  }
};

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

export const fetchServerNotes = async (
  params: FetchNotesParams = {}
): Promise<FetchNotesResponse> => {
  try {
    const cookieStore = await cookies();
    const { page = 1, perPage = 12, search = '', tag } = params;

    const response = await api.get<{ notes: Note[]; totalPages: number }>('/notes', {
      params: { page, perPage, ...(search && { search }), ...(tag && { tag }) },
      headers: { Cookie: cookieStore.toString() },
    });

    return {
      page,
      perPage,
      data: response.data.notes,
      total: response.data.totalPages,
    };
  } catch {
    return { page: 1, perPage: 12, data: [], total: 0 };
  }
};

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
