import {
    fetchUserStart,
    fetchUserSuccess,
    fetchUserFailure,
    fetchUserUpdate
  } from "../reducers/sessionReducer";
  
  import { fetchUserData } from "../services/sessionService";
  
  export const fetchUser = (query) => async (dispatch) => {
    try {
      dispatch(fetchUserStart());
      const data = await fetchUserData(query);
      if(data.autenticado){
        console.log(data);        
        dispatch(fetchUserSuccess({
          data: data,
        }));
      }else{
        dispatch(fetchUserFailure(data.mensaje));  
      }
      
    } catch (error) {
      dispatch(fetchUserFailure(error));
    }
  };

  export const updateUser = () => (dispatch) => {
    try {
      dispatch(fetchUserStart());
      const data = JSON.parse(localStorage.getItem("user"));
      if(data && data.autenticado){
        console.log(data);        
        dispatch(fetchUserUpdate({
          data: data,
        }));
      }else{
        if(data){
          dispatch(fetchUserFailure(data.mensaje));  
        }else{
          dispatch(fetchUserFailure("Sesión caducada"));  
        }
      }
      
    } catch (error) {
      dispatch(fetchUserFailure(error));
    }
  }    
