import React, { createContext, useContext, ReactNode } from 'react';
import { useWeeklyData } from '../hooks/useWeeklyData';
import { useToast } from '../hooks/useToast';
import { ToastType } from '../components/Toast';
import { Account, WeeklyData, DailyActivities, ScoreBreakdown } from '../types';

interface AppContextValue {
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
  showToast: (message: string, type?: ToastType) => void;
  toast: { message: string; type: ToastType; visible: boolean };
  hideToast: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const weeklyData = useWeeklyData();
  const { toast, showToast, hideToast } = useToast();

  return (
    <AppContext.Provider value={{ ...weeklyData, showToast, toast, hideToast }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
