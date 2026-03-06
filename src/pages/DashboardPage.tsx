import { Link } from 'react-router-dom';
import { Plus, Settings, Share2, Calendar as CalendarIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import client from '../api/client';
import { Calendar } from '../types';

export default function DashboardPage() {
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get('/calendars/my')
      .then(res => {
        setCalendars(res.data.calendars);
        setLoading(false);
      })
      .catch(() => {
        // 실제 API 연결 전이므로 더미 데이터 설정 (데모용)
        setCalendars([
          {
            slug: 'Ab3dE9xR',
            title: '팀 프로젝트 정기 회의',
            start_date: '2026-03-01',
            end_date: '2026-03-31',
            is_closed: false,
            hostParticipantUuid: 'host-123',
            created_at: '2026-02-28'
          },
          {
            slug: 'XyZ789Qw',
            title: '동아리 MT 날짜 투표',
            start_date: '2026-04-10',
            end_date: '2026-04-20',
            is_closed: true,
            hostParticipantUuid: 'host-123',
            created_at: '2026-03-01'
          }
        ]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <header className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-3">
          <CalendarIcon className="text-primary" size={40} />
          <h1 className="text-4xl">내 캘린더</h1>
        </div>
        <Link to="/calendars/new" className="btn-primary flex items-center gap-2 text-lg">
          <Plus size={24} /> 새 캘린더
        </Link>
      </header>

      {loading ? (
        <div className="text-center py-20 text-slate-400">불러오는 중...</div>
      ) : calendars.length > 0 ? (
        <div className="grid gap-6">
          {calendars.map((cal) => (
            <div key={cal.slug} className="card-kawaii flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-2xl">{cal.title}</h2>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${cal.is_closed ? 'bg-slate-100 text-slate-400' : 'bg-secondary text-slate-700'}`}>
                    {cal.is_closed ? '마감됨' : '진행중'}
                  </span>
                </div>
                <p className="text-slate-500">
                  {cal.start_date} ~ {cal.end_date}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button className="p-3 bg-slate-50 rounded-2xl hover:bg-softPink transition-all" title="공유하기">
                  <Share2 size={24} className="text-slate-600" />
                </button>
                <Link to={`/c/${cal.slug}`} className="btn-primary">
                  상세 보기
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-50 rounded-kawaii border-2 border-dashed border-slate-200">
          <p className="text-xl text-slate-400 mb-6">아직 만든 캘린더가 없어요!</p>
          <Link to="/calendars/new" className="btn-primary">
            첫 캘린더 만들기
          </Link>
        </div>
      )}
    </div>
  );
}
