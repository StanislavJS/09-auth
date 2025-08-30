import type { Note, NoteTag } from '@/types/note';
import { User } from '@/types/user';
import { api } from './api';

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: NoteTag;
}

export interface FetchNotesResponse {
  data: Note[];
  total: number;
  page: number;
  perPage: number;
}

export interface CreateNotePayload {
  title: string;
  content: string;
  tag: NoteTag;
}

interface RawFetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

interface CheckSessionResponse {
  success: boolean;
}

export type RegisterRequest = {
  email: string;
  password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

interface UpdateMeRequest {
  username: string;
}

// ---------------- NOTES ----------------

export const fetchNotes = async (
  params: FetchNotesParams = {}
): Promise<FetchNotesResponse> => {
  const { page = 1, perPage = 12, search = '', tag } = params;

  const response = await api.get<RawFetchNotesResponse>('/notes', {
    params: {
      page,
      perPage,
      ...(search && { search }),
      ...(tag && { tag }),
    },
  });

  return {
    page,
    perPage,
    data: response.data.notes,
    total: response.data.totalPages,
  };
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const res = await api.get<Note>(`/notes/${id}`);
  return res.data;
};

export const createNote = async (
  noteData: CreateNotePayload
): Promise<Note> => {
  const res = await api.post<Note>('/notes', noteData);
  return res.data;
};

export const deleteNote = async (noteId: string): Promise<Note> => {
  const res = await api.delete<Note>(`/notes/${noteId}`);
  return res.data;
};

// ---------------- AUTH ----------------

export const register = async (data: RegisterRequest): Promise<User> => {
  const res = await api.post<User>('/auth/register', data);
  return res.data;
};

export const login = async (data: LoginRequest): Promise<User> => {
  const res = await api.post<User>('/auth/login', data);
  return res.data;
};

export const checkSession = async (): Promise<boolean> => {
  const res = await api.get<CheckSessionResponse>('/auth/session');
  return res.data.success;
};

export const getMe = async (): Promise<User> => {
  const res = await api.get<User>('/users/me');
  return res.data;
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};

// ---------------- USER ----------------

export const updateMe = async (data: UpdateMeRequest): Promise<User> => {
  const res = await api.patch<User>('/users/me', data);
  return res.data;
};
