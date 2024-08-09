import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Utils } from './lib/utils.js';
import { PrimeReactProvider } from "primereact/api";
import store from "./redux/store/store";
import { Provider } from "react-redux";
import Auditoria from './pages/auditoria/auditoria/main/Auditoria.jsx';
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import Login from './pages/Login/Login.jsx';
import PrivateRoute from './PrivateRoute.jsx'; // Importar PrivateRoute

window.initPage = (basePath) => {
  let baseApi = basePath;
  if (!baseApi) baseApi = '/';
  if (baseApi.trim() == '') baseApi = '/';
  if (baseApi[baseApi.length - 1] !== '/') baseApi += '/';

  Utils.BASE_PATH = baseApi;

  const router = createBrowserRouter(
    [
      {
        path:'/auditoria',
        element: (
          <PrivateRoute>
            <Auditoria/>
          </PrivateRoute>
        )
      },
      {
        path: '/login',
        element: <Login/>,
      },
      {
        path: '*',
        element: <Navigate to="/login" replace />,
      }
    ],
    { basename: '/auditoria-medica' },
  );

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <PrimeReactProvider>
        <Provider store={store}>
          <RouterProvider router={router} />
        </Provider>
      </PrimeReactProvider>
    </React.StrictMode>,
  );
};


window.initPage('/');