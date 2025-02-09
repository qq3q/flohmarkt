import {useRootStore}    from '../../stores/RootStore';
import React             from 'react';
import {observer}        from 'mobx-react-lite';
import {usePageLauncher} from './usePageLauncher';
import TransactionForm   from './TransactionForm';
import TransactionList   from './TransactionList';
import {Layout}          from '../../components/AppLayout';
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

      return <Layout>
         <Layout.Content>
            <Layout.ContentLoading/>
         </Layout.Content>
      </Layout>
   }

   if (cashPointEventStore.status === 'synced') {

      return <Layout>
         <Layout.Content>
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
         </Layout.Content>
         <Layout.Sider>
            {transactionStore.opened && !transactionStore.syncing && <TransactionList/>}
         </Layout.Sider>
      </Layout>
   }

   // cashPointEventStore.status === 'sync_failed'
   return <Layout>
      <Layout.Content>
         <Alert.Error description="Die Veranstaltung konnte nicht geladen werden."/>
      </Layout.Content>
   </Layout>
});

export default CashPointPage;
