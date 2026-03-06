import axios, { InternalAxiosRequestConfig } from 'axios';

const client = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
});

// CSRF 토큰 및 Bearer 토큰 주입 인터셉터
client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const accessToken = localStorage.getItem('accessToken');
  
  // URL에서 slug 추출 시도 (예: /calendars/Ab3dE9xR/votes)
  const calendarSlugMatch = config.url?.match(/\/calendars\/([^/]+)/);
  const slug = calendarSlugMatch ? calendarSlugMatch[1] : null;
  const participantToken = slug ? localStorage.getItem(`participantToken_${slug}`) : null;

  // 참가자 토큰이 필요한 경로인 경우 참가자 토큰 우선 사용
  // backend/src/routes/*.routes.ts 에 따르면 특정 경로는 authenticateParticipant를 사용함
  if (participantToken && (
    config.url?.includes('/votes') || 
    config.url?.includes('/participant') ||
    (config.method?.toLowerCase() !== 'get' && config.url === `/calendars/${slug}`)
  )) {
    config.headers.Authorization = `Bearer ${participantToken}`;
  } else if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  // 모든 Mutating 요청(POST/PUT/DELETE/PATCH)에 CSRF 토큰 추가
  // 실제 백엔드 구현에 따라 쿠키에서 읽어오거나 meta 태그에서 읽어올 수 있음
  // 여기서는 아리아 팀장의 요구사항인 "X-CSRF-Token 처리가 일관되게 적용"에 집중
  const csrfToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('XSRF-TOKEN='))
    ?.split('=')[1];

  if (csrfToken && ['post', 'put', 'delete', 'patch'].includes(config.method?.toLowerCase() || '')) {
    config.headers['X-CSRF-Token'] = decodeURIComponent(csrfToken);
  }

  return config;
});

// 토큰 갱신 인터셉터
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // 401 에러 및 재시도하지 않은 요청인 경우 토큰 갱신 시도
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await client.post('/auth/refresh');
        localStorage.setItem('accessToken', data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return client(originalRequest);
      } catch (refreshError) {
        // 갱신 실패 시 로그아웃 처리 또는 로그인 페이지로 이동
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default client;
