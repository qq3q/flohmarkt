import React           from 'react';
import {SecurityStore} from './SecurityStore';

export const securityStore = new SecurityStore();

const StoreContext = React.createContext<SecurityStore | null>(null);

export const SecurityStoreProvider = ({ children }: any) => {
   return <StoreContext.Provider
      value={securityStore}
   >
      {children}
   </StoreContext.Provider>;
};

export const useSecurityStore = () => {
   const store = React.useContext(StoreContext);
   if (!store) {

      throw new Error('useSecurityStore must be used within a SecurityStoreProvider.');
   }
   return store;
};
