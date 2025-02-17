import React            from 'react';
import {router}         from './router';
import {RouterProvider} from 'react-router';

const AppRouterProvider = () => <RouterProvider router={router}/>

export default AppRouterProvider;