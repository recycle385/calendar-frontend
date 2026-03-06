import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Users, Calendar as CalendarIcon, Info, Share2, Vote as VoteIcon, Lock } from 'lucide-react';
import client from '../api/client';
import { connectSocket, disconnectSocket } from '../api/socket';
import { Calendar, DateVoteStatus, Participant } from '../types';

export default function CalendarDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [calendar, setCalendar] = useState<Calendar | null>(null);
  const [voteStatus, setVoteStatus] = useState<DateVoteStatus[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [activeTab, setActiveTab] = useState<'votes' | 'members'>('votes');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        const [calRes, votesRes, partsRes] = await Promise.all([
          client.get(`/calendars/${slug}`),
          client.get(`/calendars/${slug}/votes`),
          client.get(`/calendars/${slug}/participants`)
        ]);
        setCalendar(calRes.data.calendar);
        setVoteStatus(votesRes.data.voteStatus);
        setParticipants(partsRes.data.participants);
      } catch (err) {
        // 더미 데이터 처리 (데모용)
        setCalendar({
          slug: slug,
          title: '팀 프로젝트 정기 회의',
          description: '매주 일정을 조율하기 위한 캘린더입니다.',
          start_date: '2026-03-01',
          end_date: '2026-03-31',
          is_closed: false,
          hostParticipantUuid: 'host-1',
          created_at: '2026-02-28'
        });
        setVoteStatus([
          { date_option_id: 1, date_value: '2026-03-05', is_enabled: true, votes: [{ participant_id: 1, participant_nickname: '홍길동', participant_color: '#B1E5D9', vote_type: 'available' }] },
          { date_option_id: 2, date_value: '2026-03-06', is_enabled: true, votes: [{ participant_id: 1, participant_nickname: '홍길동', participant_color: '#B1E5D9', vote_type: 'maybe' }] }
        ]);
        setParticipants([
          { uuid: 'p1', nickname: '홍길동', color_code: '#B1E5D9', joined_at: '2026-02-28', vote_count: 5, total_dates: 31, vote_rate: 16 }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // WebSocket 연동
    const socket = connectSocket(slug);
    socket.emit('joinCalendarRoom');
    socket.on('voteUpdated', () => fetchData());
    socket.on('calendarUpdated', () => fetchData());
    socket.on('calendarClosed', () => fetchData());

    return () => {
      disconnectSocket();
    };
  }, [slug]);

  if (loading) return <div className="text-center py-40">불러오는 중...</div>;
  if (!calendar) return <div className="text-center py-40">캘린더를 찾을 수 없습니다.</div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl">{calendar.title}</h1>
            <span className={`px-4 py-1 rounded-full text-sm font-bold ${calendar.is_closed ? 'bg-red-100 text-red-500' : 'bg-secondary text-slate-700'}`}>
              {calendar.is_closed ? '투표 마감' : '진행 중'}
            </span>
          </div>
          <p className="text-slate-500 text-lg flex items-center gap-2">
            <CalendarIcon size={20} /> {calendar.start_date} ~ {calendar.end_date}
          </p>
          {calendar.description && (
            <p className="mt-4 text-slate-600 bg-slate-50 p-4 rounded-2xl flex items-start gap-2">
              <Info size={20} className="mt-1 flex-shrink-0" />
              {calendar.description}
            </p>
          )}
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-100 rounded-2xl font-bold hover:bg-slate-50 transition-all">
            <Share2 size={20} /> 공유
          </button>
        </div>
      </div>

      <div className="flex gap-4 mb-8 bg-slate-50 p-2 rounded-2xl">
        <button 
          onClick={() => setActiveTab('votes')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${activeTab === 'votes' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400'}`}
        >
          <VoteIcon size={20} /> 투표 현황
        </button>
        <button 
          onClick={() => setActiveTab('members')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${activeTab === 'members' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400'}`}
        >
          <Users size={20} /> 참가자 ({participants.length})
        </button>
      </div>

      {activeTab === 'votes' ? (
        <div className="space-y-4">
          {voteStatus.map((status) => (
            <div key={status.date_option_id} className="card-kawaii">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xl font-bold">{status.date_value}</span>
                <div className="flex gap-2">
                  <span className="text-secondary font-bold">가능 {status.votes.filter(v => v.vote_type === 'available').length}</span>
                  <span className="text-slate-300">|</span>
                  <span className="text-accent font-bold">미정 {status.votes.filter(v => v.vote_type === 'maybe').length}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {status.votes.length > 0 ? (
                  status.votes.map((vote, i) => (
                    <span 
                      key={i} 
                      className="px-3 py-1 rounded-full text-sm font-bold border-2"
                      style={{ 
                        borderColor: vote.participant_color, 
                        backgroundColor: vote.vote_type === 'available' ? `${vote.participant_color}20` : 'transparent',
                        color: '#475569'
                      }}
                    >
                      {vote.participant_nickname}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-400 text-sm italic">아직 투표가 없습니다</span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-4">
          {participants.map((p) => (
            <div key={p.uuid} className="card-kawaii flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border-4" style={{ borderColor: p.color_code }}></div>
                <div>
                  <h3 className="text-xl font-bold">{p.nickname}</h3>
                  <p className="text-slate-400 text-sm">참가일: {p.joined_at}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-slate-600">투표율 {p.vote_rate}%</p>
                <p className="text-slate-400 text-sm">{p.vote_count}개 날짜 선택</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {!calendar.is_closed ? (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-sm px-6">
          <Link to={`/c/${slug}/vote`} className="block w-full bg-primary text-slate-800 text-center py-5 rounded-kawaii font-extraBold shadow-2xl hover:shadow-primary/20 transition-all transform hover:-translate-y-1">
            일정 투표하기
          </Link>
        </div>
      ) : (
        <div className="mt-10 p-6 bg-red-50 rounded-kawaii flex items-center justify-center gap-3 text-red-500 font-bold">
          <Lock size={24} /> 방장이 투표를 마감했습니다.
        </div>
      )}
    </div>
  );
}
