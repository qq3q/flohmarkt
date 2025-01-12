import {createBrowserRouter} from 'react-router';
import RootPage              from '../../pages/RootPage';
import {homeLoader}          from '../../pages/HomePage/homeLoader';
import HomePage              from '../../pages/HomePage';
import LoginPage             from '../../pages/LoginPage';
import CashPointPage         from '../../pages/CashPointPage';
import React                 from 'react';
import {RoutePath}           from './types';
import {cashPointLoader}     from '../../pages/CashPointPage/cashPointLoader';

export const router = createBrowserRouter([{
   path    : RoutePath.Home,
   element : <RootPage/>,
   children: [{
      index  : true,
      loader : homeLoader,
      element: <HomePage/>
   }, {
      path   : RoutePath.CashPoint,
      loader : cashPointLoader,
      element: <CashPointPage/>
   }]
}, {
   path   : RoutePath.Login,
   element: <LoginPage/>
},]);