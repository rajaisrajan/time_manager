export interface HourEntry {
  weekId: string;
  day: number;
  hour: number;
  category: string;
  title: string;
  notes?: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  isDefault?: boolean;
  isProductive?: boolean;
}

export interface WeekStats {
  totalLogged: number;
  totalUnlogged: number;
  byCategory: Record<string, number>;
  byDay: Record<number, Record<string, number>>;
  productivityScore: number;
  wastedHours: number;
  avgSleep: number;
}
