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
    const report_audit = await fetchSelectionData({...query,size:data.cantidadRegistros});
    dispatch(fetchDataSuccess({
      data: data,
      query: query,
      report_audit: report_audit
    }));
    
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