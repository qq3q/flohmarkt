import React                 from 'react';
import {RoutePath}           from './types';
import {createBrowserRouter} from 'react-router';
import RootPage              from '../../pages/RootPage';
import LoginPage             from '../../pages/LoginPage';
import CashPointPage         from '../../pages/CashPointPage';
import HomePage              from '../../pages/HomePage';

export const router = createBrowserRouter([{
   path    : RoutePath.Home,
   element : <RootPage/>,
   children: [{
      index  : true,
      element: <HomePage/>
   }, {
      index  : true,
      path: RoutePath.CashPoint, // loader : cashPointLoader,
      element: <CashPointPage/>
   }]
}, {
   path   : RoutePath.Login,
   element: <LoginPage/>
},]);