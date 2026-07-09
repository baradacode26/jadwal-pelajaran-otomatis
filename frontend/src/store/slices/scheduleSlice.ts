import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Schedule {
  id: string;
  name: string;
  status: string;
  quality: number;
  conflictCount: number;
}

interface ScheduleState {
  schedules: Schedule[];
  currentSchedule: Schedule | null;
  isLoading: boolean;
  error: string | null;
  total: number;
}

const initialState: ScheduleState = {
  schedules: [],
  currentSchedule: null,
  isLoading: false,
  error: null,
  total: 0,
};

const scheduleSlice = createSlice({
  name: 'schedule',
  initialState,
  reducers: {
    setSchedules: (state, action: PayloadAction<{ data: Schedule[]; total: number }>) => {
      state.schedules = action.payload.data;
      state.total = action.payload.total;
    },
    setCurrentSchedule: (state, action: PayloadAction<Schedule>) => {
      state.currentSchedule = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

export const { setSchedules, setCurrentSchedule, setLoading, setError } = scheduleSlice.actions;
export default scheduleSlice.reducer;
