import {NavLink, Outlet, useNavigate} from 'react-router';
import {observer}                     from 'mobx-react-lite';
import {RoutePath}           from '../../container/AppRouterProvider/types';
import LogoutButton          from '../../components/LogoutButton';
import Navigation            from '../../components/Navigation';
import React                 from 'react';
import {useNavigationItems}  from '../../hooks/useNavigationItems';
import {Flex, Space} from 'antd';
import {useRootStore}        from '../../stores/RootStore';
import * as AppLayout from '../../components/AppLayout'

const RootPage = observer(() => {
   const {securityStore} = useRootStore();
   const navigate = useNavigate();
   const navItems = useNavigationItems();
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
         <Flex
            justify="space-between"
            align="center"
         >
            <Space>
               <Navigation items={navItems}/>
               <NavLink to={RoutePath.Home}>Floh 2.0</NavLink>
            </Space>
            <Space>
               {securityStore.user}
               <LogoutButton
                  onClick={onLogout}
               />
            </Space>
         </Flex>
      </AppLayout.PageHeader>
      <AppLayout.PageContent>
         <Outlet/>
      </AppLayout.PageContent>
   </AppLayout.PageLayout>
})

export default RootPage;
