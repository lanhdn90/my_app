import { PayloadAction } from '@reduxjs/toolkit';
import { studentActions } from './studentSlice';
import { takeLatest, call, put, debounce } from 'redux-saga/effects';
import { ListParams, ListResponse, Student } from 'models';
import { StudentApi } from 'api/StudentApi';

function* fetchStudentList(action: PayloadAction<ListParams>) {
  try {
    const response: ListResponse<Student> = yield call(StudentApi.getAll, action.payload);
    yield put(studentActions.fetchStudentListSuccess(response));
  } catch (error) {
    console.log('Failed to fetch student list', error);
    yield put(studentActions.fetchStudentListFailed());
  }
}

function* handleSearchDebounce(action: PayloadAction<ListParams>){
  yield put(studentActions.setFilter(action.payload))
}

export default function* studentSaga() {
  yield takeLatest(studentActions.fetchStudentList, fetchStudentList);
  yield debounce(500,studentActions.setFilterWithDebounce.type,handleSearchDebounce)
}
