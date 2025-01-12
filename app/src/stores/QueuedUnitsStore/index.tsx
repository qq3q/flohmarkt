import React              from 'react';
import {QueuedUnitsStore} from './QueuedUnitsStore';

export const queuedUnitsStore = new QueuedUnitsStore();

const StoreContext = React.createContext<QueuedUnitsStore | null>(null);

export const QueuedUnitsStoreProvider = ({children}: any) => {
   return <StoreContext.Provider
      value={queuedUnitsStore}
   >
      {children}
   </StoreContext.Provider>;
};

export const useQueuedUnitsStore = () => {
   const store = React.useContext(StoreContext);
   if (!store) {

      throw new Error('useQueuedUnitsStore must be used within a QueuedUnitsStoreProvider.');
   }
   return store;
};
