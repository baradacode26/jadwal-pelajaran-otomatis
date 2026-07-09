import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import scheduleReducer from './slices/scheduleSlice';
import masterDataReducer from './slices/masterDataSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    schedule: scheduleReducer,
    masterData: masterDataReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
