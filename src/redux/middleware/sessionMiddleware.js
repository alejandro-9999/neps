import { fetchUserFailure } from '../reducers/sessionReducer';

const sessionMiddleware = store => next => action => {
    if (action.type === 'user/fetchUserSuccess') {
        const expiryTime = new Date().getTime() + 30 * 60 * 1000; // 30 minutos
        localStorage.setItem('user', JSON.stringify(action.payload.data));
        localStorage.setItem('expiryTime', expiryTime);
        window.location.href = '/auditoria';
    }

    if (action.type === 'user/fetchUserFailure') {
        localStorage.removeItem('user');
        localStorage.removeItem('expiryTime');
    }

    const expiryTime = localStorage.getItem('expiryTime');
    if (expiryTime && new Date().getTime() > expiryTime) {
        localStorage.removeItem('user');
        localStorage.removeItem('expiryTime');
        next(fetchUserFailure('Session expired'));
        console.log("hola login")
        window.location.href = '/login'; // Redireccionar a login
    }

    return next(action);
};

export default sessionMiddleware;