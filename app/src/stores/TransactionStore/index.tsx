import React              from 'react';
import {TransactionStore} from './TransactionStore';
import {queuedUnitsStore} from '../QueuedUnitsStore';

export const transactionStore = new TransactionStore(queuedUnitsStore);

const StoreContext = React.createContext<TransactionStore | null>(null);

export const TransactionStoreProvider = ({children}: any) => {
   return <StoreContext.Provider
      value={transactionStore}
   >
      {children}
   </StoreContext.Provider>;
};

export const useTransactionStore = () => {
   const store = React.useContext(StoreContext);
   if (!store) {

      throw new Error('useTransactionStore must be used within a TransactionStoreProvider.');
   }
   return store;
};
