// app/(private routes)/profile/page.tsx
import { redirect } from 'next/navigation';
import { getServerMe } from '@/lib/api/serverApi';
import ProfileClient from './ProfileClient';
import type { Metadata } from 'next';
import type { User } from '@/types/user';

export const metadata: Metadata = {
  title: 'Profile | NoteHub',
  description: 'Your profile page on NoteHub',
};

export default async function ProfilePage() {
  // 🔹 Получаем пользователя с сервера
  const user: User | null = await getServerMe();

  // 🔹 Если пользователь не авторизован, редирект на страницу входа
  if (!user) redirect('/sign-in');

  // 🔹 Клиентский компонент для интерактивного UI
  return <ProfileClient user={user} />;
}
