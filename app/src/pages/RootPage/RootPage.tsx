import {Outlet, useNavigate} from 'react-router';
import {observer}            from 'mobx-react-lite';
import {RoutePath}           from '../../container/AppRouterProvider/types';
import React                 from 'react';
import {useNavigationItems}  from '../../hooks/useNavigationItems';
import {useRootStore}        from '../../stores/RootStore';
import * as AppLayout        from '../../components/AppLayout'
import Header                from '../../components/Header';

const RootPage = observer(() => {
   const rootStore = useRootStore();
   const {
      securityStore,
      transactionStore,
      cashPointEventStore
   } = rootStore;
   const navigate = useNavigate();
   const navItems = useNavigationItems();
   const syncing = transactionStore.syncing || cashPointEventStore.status === 'syncing';

   const onLogout = async() => {
      try {
         await securityStore.logout();
         navigate(RoutePath.Login);
      } catch (e) {
         console.warn(e);
      }
   }

   return <AppLayout.PageLayout>
      <AppLayout.PageHeader>
         <Header
            disabled={syncing}
            username={securityStore.user ?? ''}
            navItems={navItems}
            onLogout={onLogout}
         />
      </AppLayout.PageHeader>
      <AppLayout.PageContent>
         <Outlet/>
      </AppLayout.PageContent>
   </AppLayout.PageLayout>
})

export default RootPage;
