import { useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    // 실제 백엔드 구글 로그인 엔드포인트로 리디렉션
    window.location.href = `${import.meta.env.VITE_API_BASE_URL || '/api/v1'}/auth/google`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md card-kawaii text-center">
        <div className="flex flex-col items-center mb-10">
          <CalendarIcon className="text-primary mb-4" size={64} />
          <h1 className="text-3xl mb-2">반가워요!</h1>
          <p className="text-slate-500 text-lg">Moim에 오신 것을 환영합니다</p>
        </div>

        <button 
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-4 border-2 border-slate-100 hover:border-primary px-6 py-4 rounded-2xl transition-all font-bold text-lg mb-6"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
          Google로 계속하기
        </button>

        <p className="text-sm text-slate-400">
          계속 진행함으로써 이용약관 및 <br /> 
          개인정보 처리방침에 동의하게 됩니다.
        </p>
      </div>
    </div>
  );
}
