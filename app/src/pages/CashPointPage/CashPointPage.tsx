import {useRootStore} from '../../stores/RootStore';
import React from 'react';
import {observer}     from 'mobx-react-lite';
import {usePageLauncher} from './usePageLauncher';
import {Layout} from 'antd';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';

const CashPointPage = observer(() => {
   usePageLauncher();
   const {
      cashPointEventStore,
      transactionStore,
      queuedUnitsStore,} = useRootStore();

   switch (cashPointEventStore.status) {
      case 'syncing':
         return <>Loading...</>;
      case 'synced':
         return <Layout>
            <Layout.Content>
               {queuedUnitsStore.lastFetchFailed &&
                  <p>Daten von externen Geräten (Scannern) konnte nicht geladen werden.</p>}
               {transactionStore.opened && transactionStore.saving && <p>Loading</p>}
               {transactionStore.opened && !transactionStore.saving && <>
                  {transactionStore.lastSaveFailed && <p>Fehler beim Speichern</p>}
                  <TransactionForm/>
               </>}
            </Layout.Content>
            <Layout.Sider>
               Title: {cashPointEventStore.eventModel.data.title}
               <TransactionList/>
            </Layout.Sider>
         </Layout>
   }

   return <>
      <div>CashPoint Page</div>
   </>
});

export default CashPointPage;
