import React from 'react';
import { Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from './redux/actions/sessionActions';

const PrivateRoute = ({ children }) => {
    

    
    const dispatch = useDispatch();

    dispatch(updateUser());

    const user = useSelector(state => state.session.data);


    if (!user) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default PrivateRoute;