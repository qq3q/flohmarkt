import {Outlet, useNavigate} from 'react-router';
import {observer}            from 'mobx-react-lite';
import {RoutePath}           from '../../container/AppRouterProvider/types';
import LogoutButton          from '../../components/LogoutButton';
import Navigation            from '../../components/Navigation';
import React                 from 'react';
import {useNavigationItems}  from '../../hooks/useNavigationItems';
import {Flex, Layout, Space} from 'antd';
import {Content, Header}     from 'antd/es/layout/layout';
import {useRootStore}        from '../../stores/RootStore';
import {HEADER_HEIGHT}       from './constants';

const RootPage = observer(() => {
   const {securityStore, cashPointEventStore, transactionStore} = useRootStore();
   const navigate = useNavigate();
   const navItems = useNavigationItems();
   const onLogout = async() => {
      try {
         await securityStore.logout();
         transactionStore.close();
         cashPointEventStore.reset();
         navigate(RoutePath.Login);
      } catch (e) {
         // @todo error handling
         console.error(e);
      }
   }

   return <Layout style={{minHeight: '100vh', minWidth: '800px'}}>
      <Header style={{height: HEADER_HEIGHT}}>
         <Flex
            justify="space-between"
            align="middle"
         >
            <Space>
               <Navigation items={navItems}/>
               Floh 2.0
            </Space>
            <Space>
               {securityStore.user}
               <LogoutButton
                  onClick={onLogout}
               />
            </Space>
         </Flex>
      </Header>
      <Content>
         <Outlet/>
      </Content>
   </Layout>
})

export default RootPage;
