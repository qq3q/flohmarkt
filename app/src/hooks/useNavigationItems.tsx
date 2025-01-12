import {MenuProps}        from 'antd';
import {useSecurityStore} from '../stores/SecurityStore';
import {Link}             from 'react-router';
import {RoutePath}        from '../container/AppRouterProvider/types';
import React              from 'react';

export const useNavigationItems = (): MenuProps['items'] => {
   const securityStore = useSecurityStore();

   const items: MenuProps['items'] = [];
   if(securityStore.hasRole('ROLE_CASH_POINT')) {
      items.push({label: <Link to={RoutePath.CashPoint}>Kasse</Link>, key: '0'});
   }

   return items;
}