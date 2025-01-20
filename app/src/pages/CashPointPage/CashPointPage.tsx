import {useRootStore} from '../../stores/RootStore';
import React from 'react';
import {observer} from 'mobx-react-lite';
import {usePageLauncher} from './usePageLauncher';
import {Layout,} from 'antd';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';
import {HEADER_HEIGHT} from '../RootPage/constants';

const CashPointPage = observer(() => {
   usePageLauncher();
   const {
      cashPointEventStore,
      transactionStore,
      queuedUnitsStore,
   } = useRootStore();

   switch (cashPointEventStore.status) {
      case 'syncing':
         return <>Loading...</>;
      case 'synced':
         return <Layout>
            <Layout.Content
               style={{
                  background: '#fff',
                  padding:    '0.5em',
                  minHeight:  `calc(100vh - ${HEADER_HEIGHT})`
               }}
            >
               {queuedUnitsStore.lastFetchFailed &&
                  <p>Daten von externen Geräten (Scannern) konnte nicht geladen werden.</p>}
               {transactionStore.opened && transactionStore.syncing && <p>Loading</p>}
               {transactionStore.opened && !transactionStore.syncing && <>
                  {transactionStore.lastSaveFailed && <p>Fehler beim Speichern</p>}
                  {transactionStore.lastDeleteFailed && <p>Fehler beim Löschen</p>}
                  <TransactionForm/>
               </>}
            </Layout.Content>
            <Layout.Sider
               width="24em"
               style={{padding: '0 1em'}}
            >
               <TransactionList/>
            </Layout.Sider>
         </Layout>
   }

   return <>
      <div>CashPoint Page</div>
   </>
});

export default CashPointPage;
