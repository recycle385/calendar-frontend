export interface User {
  user_uuid: string;
  email: string;
  nickname: string;
  profile_image_url?: string;
  isTermsAgreed: boolean;
  created_at: string;
}

export interface Calendar {
  slug: string;
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
  is_closed: boolean;
  hostParticipantUuid: string;
  created_at: string;
}

export interface Participant {
  uuid: string;
  nickname: string;
  color_code: string;
  joined_at: string;
  vote_count: number;
  total_dates: number;
  vote_rate: number;
}

export type VoteType = 'available' | 'unavailable' | 'maybe';

export interface Vote {
  participant_id: number;
  participant_nickname: string;
  participant_color: string;
  vote_type: VoteType;
}

export interface DateVoteStatus {
  date_option_id: number;
  date_value: string;
  is_enabled: boolean;
  votes: Vote[];
}
