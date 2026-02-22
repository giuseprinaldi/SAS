export interface Account {
  id: string;
  name: string;
  createdAt: string;
}

export type DayOfWeek = 0 | 1 | 2 | 3 | 4;

export const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] as const;
export const DAY_FULL_LABELS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
] as const;

export interface WeeklyCallData {
  [accountId: string]: boolean[];
}

export interface DailyActivities {
  prospectsVisited: number;
  coldCalls: number;
  brokerVisits: number;
  casesConverted: number;
  endOfDayReview: boolean;
  cuttings: number;
}

export interface WeeklyData {
  weekStartDate: string;
  calls: WeeklyCallData;
  dailyActivities: { [dayIndex: number]: DailyActivities };
}

export const DEFAULT_DAILY_ACTIVITIES: DailyActivities = {
  prospectsVisited: 0,
  coldCalls: 0,
  brokerVisits: 0,
  casesConverted: 0,
  endOfDayReview: false,
  cuttings: 0,
};

export interface ScoreBreakdown {
  salesCalls: { score: number; max: number; current: number; target: number };
  prospects: { score: number; max: number; current: number; target: number };
  coldCalls: { score: number; max: number; current: number; target: number };
  brokerVisits: { score: number; max: number; current: number; target: number };
  casesConverted: { score: number; max: number; current: number; target: number };
  endOfDayReviews: { score: number; max: number; current: number; target: number };
  cuttings: { score: number; max: number; current: number };
  total: number;
  bonus: number;
}
