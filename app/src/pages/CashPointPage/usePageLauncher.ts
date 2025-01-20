import {useRootStore} from '../../stores/RootStore';
import {useNavigate}  from 'react-router';
import {useEffect}    from 'react';
import {RoutePath}    from '../../container/AppRouterProvider/types';

export const usePageLauncher = () => {
   const {
      securityStore,
      cashPointEventStore,
      transactionStore
   } = useRootStore();
   const navigate = useNavigate();

   useEffect(() => {
      if (!securityStore.hasRole('ROLE_CASH_POINT')) {
         navigate(RoutePath.Login);

         return;
      }
      console.log('usePageLauncher', cashPointEventStore.status);
      if (cashPointEventStore.status === 'not_synced') {
         (async () => {
            await cashPointEventStore.sync();
            transactionStore.open();
         } )();
      }

      return () => transactionStore.close();
   }, [navigate, cashPointEventStore, securityStore]);
};
