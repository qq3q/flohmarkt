import {Outlet, useNavigate} from 'react-router';
import {observer}            from 'mobx-react-lite';
import {useSecurityStore}    from '../../stores/SecurityStore';
import {RoutePath}           from '../../container/AppRouterProvider/types';
import LogoutButton          from '../../components/LogoutButton';
import Navigation            from '../../components/Navigation';
import React                 from 'react';
import {useNavigationItems}  from '../../hooks/useNavigationItems';
import {Layout}          from 'antd';
import {Content, Header} from 'antd/es/layout/layout';

const RootPage = observer(() => {
   const securityStore = useSecurityStore();
   const navigate = useNavigate();
   const navItems = useNavigationItems();
   const onLogout = async() => {
      try {
         await securityStore.logout();
         navigate(RoutePath.Login);
      } catch (e) {
         // @todo error handling
         console.error(e);
      }
   }

   return <Layout>
      <Header>
         <Navigation items={navItems}/>
         Floh 2.0
         {securityStore.user}
         <LogoutButton
            onClick={onLogout}
         />
      </Header>
      <Content>
         <Outlet/>
      </Content>
   </Layout>
})

export default RootPage;
