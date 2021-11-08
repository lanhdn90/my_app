import { PayloadAction } from '@reduxjs/toolkit';
import { push } from 'connected-react-router';
import { fork, take, call, delay, put } from 'redux-saga/effects';
import { LoginPayLoad, authActions } from './authSlice';

function* handleLogin(payload: LoginPayLoad) {
  try {
    console.log('Handle Login ', payload);
    yield delay(1000);
    localStorage.setItem('access_token', 'fake token');
    yield put(
      authActions.loginSuccess({
        id: 1,
        name: 'Easy Frontend',
      })
    );
    yield put(push('/admin/dashboard'));
  } catch (error: any) {
    yield put(authActions.loginFailed(error.message));
  }
}
function* handleLogOut() {
  console.log('Handle LogOut');
  localStorage.removeItem('access_token');
  yield put(push('/login'));
}
function* watchLoginFlow() {
  while (true) {
    const isLoggedIn = Boolean(localStorage.getItem('access_token'));
    if (!isLoggedIn) {
      const action: PayloadAction<LoginPayLoad> = yield take(authActions.login.type);
      yield fork(handleLogin, action.payload);
    }

    yield take(authActions.logout.type);
    //dung doi ham duoi thuc hien xong
    yield call(handleLogOut);
  }
}

export default function* authSaga() {
  yield fork(watchLoginFlow);
}
