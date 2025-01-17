import {useRootStore} from '../../stores/RootStore';
import React from 'react';
import {observer}     from 'mobx-react-lite';
import {usePageLauncher} from './usePageLauncher';
import Content           from './Content';

const CashPointPage = observer(() => {
   usePageLauncher();
   const {cashPointEventStore} = useRootStore();

   switch (cashPointEventStore.status) {
      case 'syncing':
         return <>Loading...</>;
      case 'synced':
         return <Content/>
   }

   return <>
      <div>CashPoint Page</div>
   </>
});

export default CashPointPage;
