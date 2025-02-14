import {Outlet, useNavigate} from 'react-router';
import {observer}            from 'mobx-react-lite';
import {RoutePath}           from '../../container/AppRouterProvider/types';
import React                 from 'react';
import {useNavigationItems}  from '../../hooks/useNavigationItems';
import {useRootStore}        from '../../stores/RootStore';
import {PageLayout}          from '../../components/AppLayout'
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
         navigate(0);
      } catch (e) {
         console.warn(e);
      }
   }

   return <PageLayout>
      <PageLayout.Header>
         <Header
            disabled={syncing}
            username={securityStore.user ?? ''}
            navItems={navItems}
            onLogout={onLogout}
         />
      </PageLayout.Header>
      <PageLayout.Content>
         <Outlet/>
      </PageLayout.Content>
   </PageLayout>
})

export default RootPage;
