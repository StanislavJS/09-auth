'use client';

import { checkSession, getMe } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import { useEffect, useState } from 'react';

type Props = { children: React.ReactNode };

const AuthProvider = ({ children }: Props) => {
  const setUser = useAuthStore((state) => state.setUser);
  const clearIsAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchSession = async () => {
      try {
        const response = await checkSession();
        if (response) {
          const user = await getMe();
          if (isMounted) setUser(user);
        } else {
          if (isMounted) clearIsAuthenticated();
        }
      } catch {
        if (isMounted) clearIsAuthenticated();
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSession();

    return () => {
      isMounted = false;
    };
  }, [clearIsAuthenticated, setUser]);

  if (loading) return <div>Loading...</div>;
  return children;
};

export default AuthProvider;
