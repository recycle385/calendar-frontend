import { Link } from 'react-router-dom';
import { Calendar as CalendarIcon, Sparkles } from 'lucide-react';

export default function LandingPage() {
  const isLoggedIn = !!localStorage.getItem('accessToken');

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarIcon className="text-primary" size={32} />
          <span className="text-2xl font-extraBold text-slate-800">Moim</span>
        </div>
        {isLoggedIn ? (
          <Link to="/dashboard" className="btn-primary text-slate-800">
            내 대시보드
          </Link>
        ) : (
          <Link to="/login" className="btn-primary text-slate-800">
            로그인
          </Link>
        )}
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="relative mb-8">
          <Sparkles className="absolute -top-8 -right-8 text-accent animate-pulse" size={48} />
          <h1 className="text-5xl md:text-7xl mb-4 leading-tight">
            일정 조율,<br />
            <span className="text-primary">쉽고 귀엽게!</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-lg">
            링크 하나로 친구들과 가장 편한 날짜를 찾아보세요.<br />
            복잡한 로그인이 필요 없는 간편한 캘린더 서비스
          </p>
        </div>

        <Link to="/calendars/new" className="bg-primary text-slate-800 text-2xl px-12 py-5 rounded-kawaii shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 font-extraBold">
          캘린더 만들기
        </Link>
        
        <div className="mt-20 grid md:grid-cols-3 gap-8 w-full max-w-5xl">
          {[
            { title: '캘린더 생성', desc: '투표 기간을 설정하세요' },
            { title: '링크 공유', desc: '친구들에게 링크를 보내세요' },
            { title: '일정 확정', desc: '가장 많이 투표된 날짜 확인!' },
          ].map((step, i) => (
            <div key={i} className="card-kawaii flex flex-col items-center">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-xl font-extraBold mb-4">
                {i + 1}
              </div>
              <h3 className="text-xl mb-2">{step.title}</h3>
              <p className="text-slate-500">{step.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="py-10 text-center text-slate-400">
        &copy; 2026 Moim Calendar. All rights reserved.
      </footer>
    </div>
  );
}
