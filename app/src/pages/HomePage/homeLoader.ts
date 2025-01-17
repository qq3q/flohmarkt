import {redirect, Router} from 'react-router';
import {rootStore}    from '../../stores/RootStore';
import {RoutePath}        from '../../container/AppRouterProvider/types';

export const homeLoader = async() => {
   if(!rootStore.securityStore.loggedIn) {

      return redirect(RoutePath.Login);
   }
}