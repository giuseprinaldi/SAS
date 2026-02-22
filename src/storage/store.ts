import AsyncStorage from '@react-native-async-storage/async-storage';
import { Account, WeeklyData, DailyActivities, DEFAULT_DAILY_ACTIVITIES } from '../types';

const KEYS = {
  ACCOUNTS: 'sas_accounts',
  WEEKLY_DATA: (weekStart: string) => `sas_week_${weekStart}`,
} as const;

// --- Accounts ---

export async function loadAccounts(): Promise<Account[]> {
  const raw = await AsyncStorage.getItem(KEYS.ACCOUNTS);
  if (!raw) return [];
  return JSON.parse(raw) as Account[];
}

export async function saveAccounts(accounts: Account[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.ACCOUNTS, JSON.stringify(accounts));
}

export async function addAccount(name: string): Promise<Account> {
  const accounts = await loadAccounts();
  const account: Account = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
    name: name.trim(),
    createdAt: new Date().toISOString(),
  };
  accounts.push(account);
  await saveAccounts(accounts);
  return account;
}

export async function removeAccount(id: string): Promise<void> {
  const accounts = await loadAccounts();
  await saveAccounts(accounts.filter((a) => a.id !== id));
}

export async function reorderAccounts(accounts: Account[]): Promise<void> {
  await saveAccounts(accounts);
}

// --- Weekly Data ---

export async function loadWeeklyData(weekStart: string): Promise<WeeklyData> {
  const key = KEYS.WEEKLY_DATA(weekStart);
  const raw = await AsyncStorage.getItem(key);
  if (!raw) {
    return {
      weekStartDate: weekStart,
      calls: {},
      dailyActivities: {},
    };
  }
  return JSON.parse(raw) as WeeklyData;
}

export async function saveWeeklyData(data: WeeklyData): Promise<void> {
  const key = KEYS.WEEKLY_DATA(data.weekStartDate);
  await AsyncStorage.setItem(key, JSON.stringify(data));
}

export async function toggleCall(
  weekStart: string,
  accountId: string,
  dayIndex: number,
): Promise<{ data: WeeklyData; newValue: boolean }> {
  const data = await loadWeeklyData(weekStart);
  if (!data.calls[accountId]) {
    data.calls[accountId] = [false, false, false, false, false];
  }
  const newValue = !data.calls[accountId][dayIndex];
  data.calls[accountId][dayIndex] = newValue;
  await saveWeeklyData(data);
  return { data, newValue };
}

export async function updateDailyActivities(
  weekStart: string,
  dayIndex: number,
  updates: Partial<DailyActivities>,
): Promise<WeeklyData> {
  const data = await loadWeeklyData(weekStart);
  const current = data.dailyActivities[dayIndex] ?? { ...DEFAULT_DAILY_ACTIVITIES };
  data.dailyActivities[dayIndex] = { ...current, ...updates };
  await saveWeeklyData(data);
  return data;
}
