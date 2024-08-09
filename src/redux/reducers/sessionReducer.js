import { createSlice } from "@reduxjs/toolkit";


const userSlice = createSlice({
    name: 'user',
    initialState:{
        user:null,
        loading:false,
        error: null
    },
    reducers:{
        fetchUserStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchUserUpdate:(state, action)=>{
            state.loading = false;
            state.data = action.payload.data;
        },        
        fetchUserSuccess: (state, action) => {
            state.loading = false;
            state.data = action.payload.data;
        },
        fetchUserFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;            
        }
    }
});

export const {fetchUserStart,fetchUserSuccess,fetchUserFailure,fetchUserUpdate} = userSlice.actions;


export default userSlice.reducer;