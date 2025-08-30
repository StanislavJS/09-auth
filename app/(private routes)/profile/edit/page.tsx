'use client';

import css from '@/components/EditProfilePage/EditProfilePage.module.css';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { User } from '@/types/user';
import { useEffect, useState } from 'react';
import { getMe, updateMe } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';

const DEFAULT_AVATAR = '/default-avatar.png';

const EditProfilePage = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<User>();
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    let isMounted = true;

    getMe()
      .then((user) => {
        if (isMounted) {
          setUserData(user);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setError('Unable to load profile');
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!userData) return;

    if (!userData.username.trim()) {
      setError('Username cannot be empty');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      const updatedUser = await updateMe({ username: userData.username });
      setUser(updatedUser);
      router.push('/profile');
    } catch (err: any) {
      setError(
        err?.response?.data?.error || 'Unable to save changes. Please try again.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (isLoading) return <div className={css.loading}>Loading profile...</div>;

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <Image
          src={userData?.avatar || DEFAULT_AVATAR}
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />

        <form className={css.profileInfo} onSubmit={handleSubmit}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              className={css.input}
              value={userData?.username ?? ''}
              onChange={(e) =>
                setUserData(
                  userData ? { ...userData, username: e.target.value } : undefined
                )
              }
            />
          </div>

          <p>Email: {userData?.email}</p>

          {error && <p className={css.error}>{error}</p>}

          <div className={css.actions}>
            <button
              type="submit"
              className={css.saveButton}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              className={css.cancelButton}
              onClick={handleCancel}
              disabled={isSaving}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default EditProfilePage;
