import React                 from 'react';
import {RootStore} from './RootStore';

export const rootStore = new RootStore();

const StoreContext = React.createContext<RootStore | null>(null);

export const RootStoreProvider = ({children}: any) => {
   return <StoreContext.Provider
      value={rootStore}
   >
      {children}
   </StoreContext.Provider>;
};

export const useRootStore = () => {
   const store = React.useContext(StoreContext);
   if (!store) {

      throw new Error('useRootStore must be used within a RootStoreProvider.');
   }
   return store;
};
