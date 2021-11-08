import { RootState } from './../../app/store';
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { City, ListResponse } from 'models';

export interface cityState {
  list: City[];
  loading: boolean;
}

const initialState: cityState = {
  list: [],
  loading: false,
};

const citySlice = createSlice({
  name: 'city',
  initialState,
  reducers: {
    fetchCityList(state) {
      state.loading = true;
    },
    fetchCityListSuccess(state, action: PayloadAction<ListResponse<City>>) {
      state.loading = false;
      state.list = action.payload.data;
    },
    fetchCityListFailed(state) {
      state.loading = false;
    },
  },
});

export const cityActions = citySlice.actions;

export const selectCityList = (state: RootState) => state.cityReducer.list;
// Tao 1 object city tu selectCityList
export const selectCityMap = createSelector(selectCityList, (cityList) =>
  cityList.reduce((map: { [key: string]: City }, city) => {
    map[city.code] = city;
    return map;
  }, {})
);

export const selectCityOptions = createSelector(selectCityList, (cityList) =>
  cityList.map((city) => ({
    label: city.name,
    value: city.code,
  }))
);

const cityReducer = citySlice.reducer;
export default cityReducer;
