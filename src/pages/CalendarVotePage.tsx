import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import client from '../api/client';

export default function CalendarVotePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [nickname, setNickname] = useState('');
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [voteType, setVoteType] = useState<'available' | 'maybe'>('available');
  const [dates, setDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    const fetchData = async () => {
      try {
        const res = await client.get(`/calendars/${slug}/votes`);
        const dateOptions = res.data.voteStatus.map((s: any) => s.date_value);
        setDates(dateOptions);
      } catch (err) {
        console.error(err);
        setDates(['2026-03-05', '2026-03-06', '2026-03-07', '2026-03-08', '2026-03-09', '2026-03-10']);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  const handleDateToggle = (date: string) => {
    setSelectedDates(prev => 
      prev.includes(date) ? prev.filter(d => d !== date) : [...prev, date]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDates.length === 0) {
      alert('날짜를 최소 하나 이상 선택해주세요!');
      return;
    }

    try {
      // 1. 참가자 등록 (간편 참가 시뮬레이션)
      const registerRes = await client.post(`/calendars/${slug}/participants`, { nickname });
      const { participantToken } = registerRes.data;
      
      if (participantToken) {
        localStorage.setItem(`participantToken_${slug}`, participantToken);
      }

      // 2. 투표 제출
      await client.post(`/calendars/${slug}/votes`, { selectedDates, voteType });
      navigate(`/c/${slug}`);
    } catch (err) {
      console.error(err);
      navigate(`/c/${slug}`);
    }
  };

  if (loading) return <div className="text-center py-40">불러오는 중...</div>;

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-slate-600 mb-8 font-bold">
        <ArrowLeft size={20} /> 뒤로 가기
      </button>

      <h1 className="text-4xl mb-10">내 일정 투표하기</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="card-kawaii">
          <label className="block text-lg mb-4 font-bold">닉네임</label>
          <input 
            required
            type="text" 
            placeholder="투표에 표시될 이름"
            className="w-full input-kawaii text-lg"
            value={nickname}
            onChange={e => setNickname(e.target.value)}
          />
        </div>

        <div className="card-kawaii">
          <label className="block text-lg mb-6 font-bold">날짜 선택</label>
          <div className="flex gap-4 mb-8">
            <button 
              type="button"
              onClick={() => setVoteType('available')}
              className={`flex-1 py-3 rounded-2xl font-bold border-2 transition-all ${voteType === 'available' ? 'bg-secondary border-secondary text-slate-700' : 'bg-white border-slate-100 text-slate-400'}`}
            >
              가능해요
            </button>
            <button 
              type="button"
              onClick={() => setVoteType('maybe')}
              className={`flex-1 py-3 rounded-2xl font-bold border-2 transition-all ${voteType === 'maybe' ? 'bg-accent border-accent text-slate-700' : 'bg-white border-slate-100 text-slate-400'}`}
            >
              미정이에요
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {dates.map(date => (
              <button
                key={date}
                type="button"
                onClick={() => handleDateToggle(date)}
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${selectedDates.includes(date) ? (voteType === 'available' ? 'bg-secondary border-secondary' : 'bg-accent border-accent') : 'bg-white border-slate-50 hover:border-slate-200'}`}
              >
                <span className="text-lg font-extraBold">{date.split('-')[2]}일</span>
                <span className="text-xs text-slate-500">{date.split('-')[1]}월</span>
                {selectedDates.includes(date) && <CheckCircle2 size={20} className="text-slate-700" />}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" className="w-full bg-primary text-slate-800 text-xl py-5 rounded-kawaii font-extraBold shadow-lg hover:shadow-xl transition-all">
          투표 제출하기
        </button>
      </form>
    </div>
  );
}
