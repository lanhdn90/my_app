import { RootState } from './../../app/store';
import { ListParams, ListResponse, PaginationParams, Student } from 'models';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface StudentState {
  loading: boolean;
  list: Student[];
  filter: ListParams;
  pagination: PaginationParams;
}

const initialState: StudentState = {
  loading: false,
  list: [],
  filter: {
    _page: 1,
    _limit: 15,
  },
  pagination: {
    _page: 1,
    _limit: 15,
    _totalRows: 15,
  },
};

const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {
    fetchStudentList(state, action: PayloadAction<ListParams>) {
      state.loading = true;
    },
    fetchStudentListSuccess(state, action: PayloadAction<ListResponse<Student>>) {
      state.list = action.payload.data;
      state.loading = false;
      state.pagination = action.payload.pagination;
    },
    fetchStudentListFailed(state) {
      state.loading = false;
    },

    setFilter(state, action: PayloadAction<ListParams>) {
      state.filter = action.payload;
    },
    setFilterWithDebounce(state, action: PayloadAction<ListParams>) {
    },
  },
});

//Actions
export const studentActions = studentSlice.actions;

//Selectors
export const selectStudentList = (state: RootState) => state.studentReducer.list
export const selectStudentLoading = (state: RootState) => state.studentReducer.loading
export const selectStudentFilter = (state: RootState) => state.studentReducer.filter
export const selectStudentPagination = (state: RootState) => state.studentReducer.pagination
//Reducer
const studentReducer = studentSlice.reducer;
export default studentReducer;
