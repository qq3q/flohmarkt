import {MenuProps}        from 'antd';
import {Link}             from 'react-router';
import {RoutePath}        from '../container/AppRouterProvider/types';
import React              from 'react';
import {useRootStore}     from '../stores/RootStore';

export const useNavigationItems = (): MenuProps['items'] => {
   const {securityStore} = useRootStore();

   const items: MenuProps['items'] = [];
   if(securityStore.hasRole('ROLE_CASH_POINT')) {
      items.push({label: <Link to={RoutePath.CashPoint}>Kasse</Link>, key: '0'});
      items.push({label: <Link to={RoutePath.Result}>Ergebnis</Link>, key: '1'});
   }

   return items;
}