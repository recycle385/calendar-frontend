import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import client from '../api/client';

export default function AuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const code = searchParams.get('code');

  useEffect(() => {
    if (!code) {
      console.error('No authorization code found in URL');
      navigate('/login', { replace: true });
      return;
    }

    const handleCallback = async () => {
      try {
        const response = await client.get(`/auth/google/callback?code=${code}`);
        const { accessToken, isNewUser, signupToken } = response.data;

        if (isNewUser && signupToken) {
          // New user, redirect to signup for terms agreement
          navigate('/signup', { state: { signupToken }, replace: true });
        } else if (accessToken) {
          // Existing user, store token and redirect to dashboard
          localStorage.setItem('accessToken', accessToken);
          navigate('/dashboard', { replace: true });
        } else {
          // Unexpected response
          console.error('Unexpected auth response:', response.data);
          localStorage.removeItem('accessToken');
          navigate('/login', { replace: true });
        }
      } catch (err) {
        console.error('Auth callback failed:', err);
        localStorage.removeItem('accessToken');
        navigate('/login', { replace: true });
      }
    };

    handleCallback();
  }, [code, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-slate-600 font-bold text-xl">로그인 중입니다...</p>
      </div>
    </div>
  );
}
