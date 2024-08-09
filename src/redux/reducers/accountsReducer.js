import { createSlice } from "@reduxjs/toolkit";


const accountsSlice = createSlice({
    name: 'accounts',
    initialState:{
        data: null,
        loading:false,
        query:false,
        location_data:[],
        error: null
    },
    reducers:{
        fetchDataStart: (state) => {
            state.loading = true;
            state.error = null;
        },        
        fetchDataSuccess: (state, action) => {
            state.loading = false;
            state.data = action.payload.data;
            state.query = action.payload.query;
        },
        fetchDataFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;            
        },
        fetchLocationData: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchLocationDataSuccess:(state, action)=>{
            state.loading = false;
            state.location_data = action.payload;
        }
    }
});

export const {fetchDataStart,fetchDataSuccess,fetchDataFailure,fetchLocationDataSuccess} = accountsSlice.actions;


export default accountsSlice.reducer;