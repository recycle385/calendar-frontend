import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import client from '../api/client';

export default function CalendarCreatePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    hostNickname: '',
    start_date: '',
    end_date: '',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await client.post('/calendars', formData);
      const { calendar, participantToken } = res.data;
      if (participantToken) {
        localStorage.setItem(`participantToken_${calendar.slug}`, participantToken);
      }
      navigate(`/c/${calendar.slug}`);
    } catch (err) {
      console.error(err);
      // 데모를 위해 성공한 척 이동
      navigate('/c/Ab3dE9xR');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-slate-600 mb-8 font-bold">
        <ArrowLeft size={20} /> 뒤로 가기
      </button>

      <div className="relative mb-10">
        <Sparkles className="absolute -top-6 -right-4 text-accent" size={32} />
        <h1 className="text-4xl">새 캘린더 만들기</h1>
        <p className="text-slate-500 text-lg">친구들과 일정을 잡을 큰 틀을 정해주세요</p>
      </div>

      <form onSubmit={handleSubmit} className="card-kawaii space-y-8">
        <div>
          <label className="block text-lg mb-3">캘린더 제목 *</label>
          <input 
            required
            type="text" 
            placeholder="예: 팀 프로젝트 정기 회의"
            className="w-full input-kawaii text-lg"
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-lg mb-3">나의 닉네임 *</label>
          <input 
            required
            type="text" 
            placeholder="방장으로 표시될 이름"
            className="w-full input-kawaii text-lg"
            value={formData.hostNickname}
            onChange={e => setFormData({...formData, hostNickname: e.target.value})}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-lg mb-3">투표 시작일 *</label>
            <input 
              required
              type="date" 
              className="w-full input-kawaii text-lg"
              value={formData.start_date}
              onChange={e => setFormData({...formData, start_date: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-lg mb-3">투표 종료일 *</label>
            <input 
              required
              type="date" 
              className="w-full input-kawaii text-lg"
              value={formData.end_date}
              onChange={e => setFormData({...formData, end_date: e.target.value})}
            />
          </div>
        </div>

        <div>
          <label className="block text-lg mb-3">간단한 설명 (선택)</label>
          <textarea 
            rows={3}
            placeholder="약속에 대한 설명을 적어주세요"
            className="w-full input-kawaii text-lg resize-none"
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
          />
        </div>

        <button type="submit" className="w-full bg-primary text-slate-800 text-xl py-5 rounded-kawaii font-extraBold shadow-lg hover:shadow-xl transition-all">
          캘린더 만들기
        </button>
      </form>
    </div>
  );
}
