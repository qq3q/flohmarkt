import React              from 'react';
import {observer}         from 'mobx-react-lite';
import {NavLink}          from 'react-router';
import {RoutePath}        from '../../container/AppRouterProvider/types';

const Content = observer(() => {

   return <>
      <NavLink to={RoutePath.CashPoint}>Zur Kasse</NavLink>
   </>
})

export default Content;
