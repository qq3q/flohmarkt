import {redirect, Router} from 'react-router';
import {securityStore}    from '../../stores/SecurityStore';
import {RoutePath}        from '../../container/AppRouterProvider/types';
import {cashPointEventStore} from '../../stores/CashPointEventStore';

export const cashPointLoader = async(): Promise<Response | null> => {
   if(!securityStore.hasRole('ROLE_CASH_POINT')) {

      return redirect(RoutePath.Login);
   }
   await cashPointEventStore.sync();

   return null;
}