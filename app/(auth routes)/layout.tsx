'use client';

import { useState, useEffect } from 'react';

type Props = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: Props) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // имитация проверки сессии, чтобы показать лоадер
    const timer = setTimeout(() => setLoading(false), 50);
    return () => clearTimeout(timer);
  }, []);

  return <>{loading ? <div>Loading...</div> : children}</>;
}
