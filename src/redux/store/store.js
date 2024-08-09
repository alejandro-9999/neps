import { configureStore } from "@reduxjs/toolkit";
import {thunk} from "redux-thunk";
import accountsReducer from "../reducers/accountsReducer";
import sessionReducer from "../reducers/sessionReducer";
import sessionMiddleware from "../middleware/sessionMiddleware";

const store = configureStore({
  reducer: {
    accounts: accountsReducer,
    session: sessionReducer
  },
  middleware: getDefaultMiddleware => 
    getDefaultMiddleware().concat(thunk, sessionMiddleware)
});

export default store;
