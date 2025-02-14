import {useRootStore} from '../stores/RootStore';
import {useNavigate}  from 'react-router';
import {useEffect}    from 'react';
import {RoutePath}    from '../container/AppRouterProvider/types';

export const useCashPointAndResultPageLauncher = (withTransaction: boolean) => {
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
      if (cashPointEventStore.status === 'not_synced') {
         (async () => {
            await cashPointEventStore.sync();
            if (withTransaction && cashPointEventStore.status === 'synced') {
               transactionStore.open();
            }
         } )();
      }
      return () => {
         if(withTransaction) {
            transactionStore.close();
         }
         cashPointEventStore.reset();
      }
   }, []);
};
