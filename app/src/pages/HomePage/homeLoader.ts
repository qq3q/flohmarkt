import {redirect, Router} from 'react-router';
import {securityStore}    from '../../stores/SecurityStore';
import {RoutePath}        from '../../container/AppRouterProvider/types';

export const homeLoader = async() => {
   if(!securityStore.loggedIn) {

      return redirect(RoutePath.Login);
   }
}