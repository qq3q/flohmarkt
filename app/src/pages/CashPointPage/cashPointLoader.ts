import {redirect, Router} from 'react-router';
import {RoutePath}        from '../../container/AppRouterProvider/types';
import {rootStore}           from '../../stores/RootStore';

export const cashPointLoader = async(): Promise<Response | null> => {
   if(!rootStore.securityStore.hasRole('ROLE_CASH_POINT')) {

      return redirect(RoutePath.Login);
   }
   await rootStore.cashPointEventStore.sync();

   return null;
}