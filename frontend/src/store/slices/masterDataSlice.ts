import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MasterData {
  academicYears: any[];
  semesters: any[];
  subjects: any[];
  teachers: any[];
  classes: any[];
  rooms: any[];
  timeSlots: any[];
}

interface MasterDataState extends MasterData {
  isLoading: boolean;
  error: string | null;
}

const initialState: MasterDataState = {
  academicYears: [],
  semesters: [],
  subjects: [],
  teachers: [],
  classes: [],
  rooms: [],
  timeSlots: [],
  isLoading: false,
  error: null,
};

const masterDataSlice = createSlice({
  name: 'masterData',
  initialState,
  reducers: {
    setAcademicYears: (state, action: PayloadAction<any[]>) => {
      state.academicYears = action.payload;
    },
    setSemesters: (state, action: PayloadAction<any[]>) => {
      state.semesters = action.payload;
    },
    setSubjects: (state, action: PayloadAction<any[]>) => {
      state.subjects = action.payload;
    },
    setTeachers: (state, action: PayloadAction<any[]>) => {
      state.teachers = action.payload;
    },
    setClasses: (state, action: PayloadAction<any[]>) => {
      state.classes = action.payload;
    },
    setRooms: (state, action: PayloadAction<any[]>) => {
      state.rooms = action.payload;
    },
    setTimeSlots: (state, action: PayloadAction<any[]>) => {
      state.timeSlots = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setAcademicYears,
  setSemesters,
  setSubjects,
  setTeachers,
  setClasses,
  setRooms,
  setTimeSlots,
  setLoading,
  setError,
} = masterDataSlice.actions;
export default masterDataSlice.reducer;
