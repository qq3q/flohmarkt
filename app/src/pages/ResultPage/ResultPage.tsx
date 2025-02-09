import {useRootStore}    from '../../stores/RootStore';
import React             from 'react';
import {observer}        from 'mobx-react-lite';
import {usePageLauncher} from './usePageLauncher';
import * as AppLayout    from '../../components/AppLayout';
import * as Alert        from '../../components/alerts';
import SellerAmountsList from './SellerAmountsList';
import PaymentAmountsList from './PaymentAmountsList';

const ResultPage = observer(() => {
   usePageLauncher();
   const {
      cashPointEventStore,
   } = useRootStore();

   if (cashPointEventStore.status === 'syncing'
      || cashPointEventStore.status === 'not_synced') {

      return <AppLayout.Layout>
         <AppLayout.Content>
            <AppLayout.ContentLoading/>
         </AppLayout.Content>
      </AppLayout.Layout>
   }

   if (cashPointEventStore.status === 'synced') {

      return <AppLayout.Layout>
         <AppLayout.Content>
            <SellerAmountsList/>
            <PaymentAmountsList/>
         </AppLayout.Content>
      </AppLayout.Layout>
   }

   // cashPointEventStore.status === 'sync_failed'
   return <AppLayout.Layout>
      <AppLayout.Content>
         <Alert.Error description="Die Veranstaltung konnte nicht geladen werden."/>
      </AppLayout.Content>
   </AppLayout.Layout>
});

export default ResultPage;
