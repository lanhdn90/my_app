import { cityApi } from 'api/cityApi';
import { City } from './../../models/city';
import { StudentApi } from './../../api/StudentApi';
import { ListResponse } from './../../models/common';
import { dashboardActions, RankingByCity } from './dashboardSlice';
import { takeLatest, all, call, put } from 'redux-saga/effects';
import { Student } from 'models';

function* fetchStatistics() {
  const responseList: Array<ListResponse<Student>> = yield all([
    call(StudentApi.getAll, { _page: 1, _limit: 1, gender: 'male' }),
    call(StudentApi.getAll, { _page: 1, _limit: 1, gender: 'female' }),
    call(StudentApi.getAll, { _page: 1, _limit: 1, mark_gte: 8 }),
    call(StudentApi.getAll, { _page: 1, _limit: 1, mark_lte: 5 }),
  ]);
  const statistics = responseList.map((x) => x.pagination._totalRows);
  const [maleCount, femaleCount, highMarkCount, lowMarkCount] = statistics;
  yield put(
    dashboardActions.setStatistics({ maleCount, femaleCount, highMarkCount, lowMarkCount })
  );
}
function* fetchHighestStudentList() {
  const { data }: ListResponse<Student> = yield call(StudentApi.getAll, {
    _page: 1,
    _limit: 5,
    _sort: 'mark',
    _order: 'desc',
  });
  yield put(dashboardActions.setHighestStudentList(data));
}
function* fetchLowestStudentList() {
  const { data }: ListResponse<Student> = yield call(StudentApi.getAll, {
    _page: 1,
    _limit: 5,
    _sort: 'mark',
    _order: 'asc',
  });
  yield put(dashboardActions.setLowestStudentList(data));
}
function* fetchRankingByCityList() {
  //fetch city list
  const { data: cityList }: ListResponse<City> = yield call(cityApi.getAll);
  //fetch ranking per City
  const callList = cityList.map((x) =>
    call(StudentApi.getAll, {
      _page: 1,
      _limit: 5,
      _sort: 'mark',
      _order: 'desc',
      city: x.code,
    })
  );

  const responseList: Array<ListResponse<Student>> = yield all(callList);
  const rankingByCityList: Array<RankingByCity> = responseList.map((x, idx) => ({
    cityId: cityList[idx].code,
    cityName: cityList[idx].name,
    rankingList: x.data,
  }));

  yield put(dashboardActions.setRankingByCityList(rankingByCityList));
}

function* fetchDashboardData() {
  try {
    yield all([
      call(fetchStatistics),
      call(fetchHighestStudentList),
      call(fetchLowestStudentList),
      call(fetchRankingByCityList),
    ]);
    yield put(dashboardActions.fetchDataSuccess());
  } catch (error) {
    console.log('Failed to fetch dashboard data', error);
    yield put(dashboardActions.fetchDataFailed());
  }
}

export default function* dashboardSaga() {
  yield takeLatest(dashboardActions.fetchData.type, fetchDashboardData);
}
