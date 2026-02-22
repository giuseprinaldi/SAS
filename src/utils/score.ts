import {
  WeeklyData,
  DailyActivities,
  DEFAULT_DAILY_ACTIVITIES,
  ScoreBreakdown,
} from '../types';

const WEIGHTS = {
  salesCalls: 30,
  prospects: 20,
  coldCalls: 15,
  brokerVisits: 10,
  casesConverted: 15,
  endOfDayReviews: 10,
} as const;

const TARGETS = {
  salesCalls: 30,
  prospects: 5,
  coldCallsMin: 2,
  coldCallsMax: 3,
  brokerVisits: 1,
  casesConverted: 5,
  endOfDayReviews: 5,
} as const;

const CUTTING_BONUS = 3;
const MAX_CUTTING_BONUS = 10;

function countTotalCalls(data: WeeklyData): number {
  let total = 0;
  for (const accountId of Object.keys(data.calls)) {
    const days = data.calls[accountId];
    for (const checked of days) {
      if (checked) total++;
    }
  }
  return total;
}

function aggregateWeeklyActivities(data: WeeklyData): {
  prospectsVisited: number;
  coldCalls: number;
  brokerVisits: number;
  casesConverted: number;
  endOfDayReviews: number;
  cuttings: number;
} {
  const result = {
    prospectsVisited: 0,
    coldCalls: 0,
    brokerVisits: 0,
    casesConverted: 0,
    endOfDayReviews: 0,
    cuttings: 0,
  };

  for (let day = 0; day < 5; day++) {
    const activities: DailyActivities =
      data.dailyActivities[day] ?? DEFAULT_DAILY_ACTIVITIES;
    result.prospectsVisited += activities.prospectsVisited;
    result.coldCalls += activities.coldCalls;
    result.brokerVisits += activities.brokerVisits;
    result.casesConverted += activities.casesConverted;
    result.endOfDayReviews += activities.endOfDayReview ? 1 : 0;
    result.cuttings += activities.cuttings;
  }

  return result;
}

export function calculateScore(data: WeeklyData): ScoreBreakdown {
  const totalCalls = countTotalCalls(data);
  const weekly = aggregateWeeklyActivities(data);

  const salesCallsScore = Math.min(
    WEIGHTS.salesCalls,
    (totalCalls / TARGETS.salesCalls) * WEIGHTS.salesCalls,
  );

  const prospectsScore = Math.min(
    WEIGHTS.prospects,
    (weekly.prospectsVisited / TARGETS.prospects) * WEIGHTS.prospects,
  );

  // Cold calls: full score at 2, but 3 gives a slight bonus to the category (capped at weight)
  const coldCallsRatio = Math.min(weekly.coldCalls, TARGETS.coldCallsMax) / TARGETS.coldCallsMin;
  const coldCallsScore = Math.min(WEIGHTS.coldCalls, coldCallsRatio * WEIGHTS.coldCalls);

  const brokerScore = Math.min(
    WEIGHTS.brokerVisits,
    (weekly.brokerVisits / TARGETS.brokerVisits) * WEIGHTS.brokerVisits,
  );

  const casesScore = Math.min(
    WEIGHTS.casesConverted,
    (weekly.casesConverted / TARGETS.casesConverted) * WEIGHTS.casesConverted,
  );

  const eodScore = Math.min(
    WEIGHTS.endOfDayReviews,
    (weekly.endOfDayReviews / TARGETS.endOfDayReviews) * WEIGHTS.endOfDayReviews,
  );

  const cuttingsBonus = Math.min(
    MAX_CUTTING_BONUS,
    weekly.cuttings * CUTTING_BONUS,
  );

  const baseTotal =
    salesCallsScore +
    prospectsScore +
    coldCallsScore +
    brokerScore +
    casesScore +
    eodScore;

  return {
    salesCalls: {
      score: Math.round(salesCallsScore * 10) / 10,
      max: WEIGHTS.salesCalls,
      current: totalCalls,
      target: TARGETS.salesCalls,
    },
    prospects: {
      score: Math.round(prospectsScore * 10) / 10,
      max: WEIGHTS.prospects,
      current: weekly.prospectsVisited,
      target: TARGETS.prospects,
    },
    coldCalls: {
      score: Math.round(coldCallsScore * 10) / 10,
      max: WEIGHTS.coldCalls,
      current: weekly.coldCalls,
      target: TARGETS.coldCallsMax,
    },
    brokerVisits: {
      score: Math.round(brokerScore * 10) / 10,
      max: WEIGHTS.brokerVisits,
      current: weekly.brokerVisits,
      target: TARGETS.brokerVisits,
    },
    casesConverted: {
      score: Math.round(casesScore * 10) / 10,
      max: WEIGHTS.casesConverted,
      current: weekly.casesConverted,
      target: TARGETS.casesConverted,
    },
    endOfDayReviews: {
      score: Math.round(eodScore * 10) / 10,
      max: WEIGHTS.endOfDayReviews,
      current: weekly.endOfDayReviews,
      target: TARGETS.endOfDayReviews,
    },
    cuttings: {
      score: cuttingsBonus,
      max: MAX_CUTTING_BONUS,
      current: weekly.cuttings,
    },
    total: Math.round(baseTotal),
    bonus: cuttingsBonus,
  };
}

export function getScoreColor(score: number): string {
  if (score >= 85) return '#00D4AA';
  if (score >= 65) return '#6C63FF';
  if (score >= 40) return '#FFB547';
  return '#FF5757';
}

export function getScoreLabel(score: number): string {
  if (score >= 90) return 'Exceptional';
  if (score >= 80) return 'Excellent';
  if (score >= 65) return 'Strong';
  if (score >= 50) return 'On Track';
  if (score >= 30) return 'Needs Effort';
  return 'Getting Started';
}
