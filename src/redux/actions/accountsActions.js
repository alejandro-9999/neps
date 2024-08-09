import {
  fetchDataFailure,
  fetchDataStart,
  fetchDataSuccess,
  fetchLocationDataSuccess
} from "../reducers/accountsReducer";

import { fetchSelectionData, fetchLocationData } from "../services/accountsService";

export const fetchData = (query) => async (dispatch) => {
  try {
    dispatch(fetchDataStart());
    const data = await fetchSelectionData(query);
    dispatch(fetchDataSuccess({
      data: data,
      query: query
    }));
    dispatch
  } catch (error) {
    dispatch(fetchDataFailure(error));
  }
};


export const fetchLocationDataService = () => async (dispatch) => {
  try {
    dispatch(fetchDataStart());
    const data = await fetchLocationData();
    dispatch(fetchLocationDataSuccess(data));
  } catch (error) {
    dispatch(fetchDataFailure(error));
  }
}