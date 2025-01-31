import {useRootStore}    from '../../stores/RootStore';
import React             from 'react';
import {observer}        from 'mobx-react-lite';
import {usePageLauncher} from './usePageLauncher';
import TransactionForm   from './TransactionForm';
import TransactionList   from './TransactionList';
import * as AppLayout    from '../../components/AppLayout';
import * as Alert        from '../../components/alerts';

const CashPointPage = observer(() => {
   usePageLauncher();
   const {
      cashPointEventStore,
      transactionStore,
      queuedUnitsStore,
   } = useRootStore();

   if (cashPointEventStore.status === 'syncing'
      || cashPointEventStore.status === 'not_synced'
      || transactionStore.syncing) {

      return <AppLayout.Layout>
         <AppLayout.Content>
            <AppLayout.ContentLoading/>
         </AppLayout.Content>
      </AppLayout.Layout>
   }

   if (cashPointEventStore.status === 'synced') {

      return <AppLayout.Layout>
         <AppLayout.Content>
            {transactionStore.opened && !transactionStore.syncing && <>
               {queuedUnitsStore.lastFetchFailed &&
                  <Alert.Warning
                     description="Daten von externen Geräten (Scannern) konnte nicht geladen werden."
                  />}
               {transactionStore.lastSaveFailed && <Alert.Error
                  description="Die Transaktion konnte nicht gespeichert werden."
               />}
               {transactionStore.lastDeleteFailed && <Alert.Error
                  description="Die Transaktion konnte nicht gelöscht werden."
               />}
               <TransactionForm/>
            </>}
         </AppLayout.Content>
         <AppLayout.Sider>
            {transactionStore.opened && !transactionStore.syncing && <TransactionList/>}
         </AppLayout.Sider>
      </AppLayout.Layout>
   }

   // cashPointEventStore.status === 'sync_failed'
   return <AppLayout.Layout>
      <AppLayout.Content>
         <Alert.Error description="Die Veranstaltung konnte nicht geladen werden."/>
      </AppLayout.Content>
   </AppLayout.Layout>
});

export default CashPointPage;
