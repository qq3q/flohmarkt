import React                 from 'react';
import {CashPointEventStore} from './CashPointEventStore';

export const cashPointEventStore = new CashPointEventStore();

const StoreContext = React.createContext<CashPointEventStore | null>(null);

export const CashPointEventStoreProvider = ({children}: any) => {
   return <StoreContext.Provider
      value={cashPointEventStore}
   >
      {children}
   </StoreContext.Provider>;
};

export const useCashPointEventStore = () => {
   const store = React.useContext(StoreContext);
   if (!store) {

      throw new Error('useCashPointEventStore must be used within a CashPointEventStoreProvider.');
   }
   return store;
};
