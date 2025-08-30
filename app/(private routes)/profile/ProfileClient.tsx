'use client';

import { useAuthStore } from '@/lib/store/authStore';
import { logout } from '@/lib/api/clientApi';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import css from '@/components/ProfilePage/ProfilePage.module.css';
import type { User } from '@/types/user';

type Props = { user: User };

export default function ProfileClient({ user }: Props) {
  const clearIsAuthenticated = useAuthStore((state) => state.clearIsAuthenticated);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      clearIsAuthenticated();
      router.push('/sign-in');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <div>
            <Link href="/profile/edit" className={css.editProfileButton}>
              Edit Profile
            </Link>
            <button onClick={handleLogout} className={css.logoutButton}>
              Logout
            </button>
          </div>
        </div>
        <div className={css.avatarWrapper}>
          <Image
            src={user.avatar || '/default-avatar.png'}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>
        <div className={css.profileInfo}>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
        </div>
      </div>
    </main>
  );
}
