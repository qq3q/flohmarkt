import React       from 'react';
import {observer}  from 'mobx-react-lite';
import {NavLink}   from 'react-router';
import {RoutePath} from '../../container/AppRouterProvider/types';

const Content = observer(() => {

   return <>
      <p>
         <NavLink to={RoutePath.CashPoint}>Zur Kasse</NavLink>
      </p>
      <p>
         <NavLink to={RoutePath.Result}>Ergebnis</NavLink>
      </p>
   </>
})

export default Content;
