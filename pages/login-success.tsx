// pages/login-success.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function LoginSuccess() {
  const router = useRouter();

  useEffect(() => {
    const url = new URL(window.location.href);
    const token = url.searchParams.get('token');
    if (token) localStorage.setItem('token', token);
    // go to your app home
    router.replace('/directory/tasks');
  }, [router]);

  return null;
}
