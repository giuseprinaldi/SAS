import { useState, useEffect, useCallback } from 'react';
import { Account, WeeklyData, DailyActivities, ScoreBreakdown } from '../types';
import { getWeekStartDate } from '../utils/dates';
import { calculateScore } from '../utils/score';
import * as store from '../storage/store';

interface UseWeeklyDataReturn {
  weekStart: string;
  data: WeeklyData;
  accounts: Account[];
  score: ScoreBreakdown;
  loading: boolean;
  setWeekStart: (ws: string) => void;
  toggleCall: (accountId: string, dayIndex: number) => Promise<boolean>;
  updateActivities: (dayIndex: number, updates: Partial<DailyActivities>) => Promise<void>;
  addAccount: (name: string) => Promise<void>;
  removeAccount: (id: string) => Promise<void>;
  refreshAccounts: () => Promise<void>;
  refreshData: () => Promise<void>;
}

export function useWeeklyData(): UseWeeklyDataReturn {
  const [weekStart, setWeekStart] = useState(() => getWeekStartDate());
  const [data, setData] = useState<WeeklyData>({
    weekStartDate: weekStart,
    calls: {},
    dailyActivities: {},
  });
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshAccounts = useCallback(async () => {
    const accs = await store.loadAccounts();
    setAccounts(accs);
  }, []);

  const refreshData = useCallback(async () => {
    const d = await store.loadWeeklyData(weekStart);
    setData(d);
  }, [weekStart]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    Promise.all([store.loadAccounts(), store.loadWeeklyData(weekStart)]).then(
      ([accs, d]) => {
        if (!mounted) return;
        setAccounts(accs);
        setData(d);
        setLoading(false);
      },
    );
    return () => {
      mounted = false;
    };
  }, [weekStart]);

  const handleToggleCall = useCallback(
    async (accountId: string, dayIndex: number): Promise<boolean> => {
      const { data: updated, newValue } = await store.toggleCall(
        weekStart,
        accountId,
        dayIndex,
      );
      setData(updated);
      return newValue;
    },
    [weekStart],
  );

  const handleUpdateActivities = useCallback(
    async (dayIndex: number, updates: Partial<DailyActivities>) => {
      const updated = await store.updateDailyActivities(weekStart, dayIndex, updates);
      setData(updated);
    },
    [weekStart],
  );

  const handleAddAccount = useCallback(async (name: string) => {
    await store.addAccount(name);
    await refreshAccounts();
  }, [refreshAccounts]);

  const handleRemoveAccount = useCallback(
    async (id: string) => {
      await store.removeAccount(id);
      await refreshAccounts();
    },
    [refreshAccounts],
  );

  const score = calculateScore(data);

  return {
    weekStart,
    data,
    accounts,
    score,
    loading,
    setWeekStart,
    toggleCall: handleToggleCall,
    updateActivities: handleUpdateActivities,
    addAccount: handleAddAccount,
    removeAccount: handleRemoveAccount,
    refreshAccounts,
    refreshData,
  };
}
