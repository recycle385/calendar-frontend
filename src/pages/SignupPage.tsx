import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import client from '../api/client';

export default function SignupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [agreed, setAgreed] = useState(false);
  const signupToken = location.state?.signupToken;

  useEffect(() => {
    if (!signupToken) {
      alert('회원가입 토큰이 없습니다. 다시 로그인해주세요.');
      navigate('/login', { replace: true });
    }
  }, [signupToken, navigate]);

  const handleSignup = async () => {
    try {
      const response = await client.post('/auth/register', { 
        signupToken, 
        isTermsAgreed: true 
      });
      
      const { accessToken } = response.data;
      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      console.error('Signup failed:', err);
      alert('회원가입에 실패했습니다.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md card-kawaii">
        <h1 className="text-3xl mb-8">약관에 동의해주세요</h1>
        
        <div className="space-y-6 mb-10">
          <div className="flex items-start gap-3">
            <input 
              type="checkbox" 
              className="mt-1 w-5 h-5 accent-primary" 
              id="terms"
              checked={agreed}
              onChange={e => setAgreed(e.target.checked)}
            />
            <label htmlFor="terms" className="text-slate-600">
              [필수] 이용약관 및 개인정보 처리방침에 동의합니다.
            </label>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl text-sm text-slate-400 h-32 overflow-y-auto">
            여기에 이용약관 전문이 들어갑니다... 일정 조율 서비스 Moim을 이용해주셔서 감사합니다. 본 서비스는 구글 로그인을 기반으로 하며...
          </div>
        </div>

        <button 
          disabled={!agreed}
          onClick={handleSignup}
          className={`w-full py-5 rounded-kawaii font-extraBold text-xl transition-all ${agreed ? 'bg-primary text-slate-800 shadow-lg hover:shadow-xl' : 'bg-slate-100 text-slate-300'}`}
        >
          가입 완료
        </button>
      </div>
    </div>
  );
}
