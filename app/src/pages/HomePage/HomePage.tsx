import {useRootStore} from '../../stores/RootStore';
import {useNavigate}      from 'react-router';
import React, {useEffect} from 'react';
import {RoutePath}        from '../../container/AppRouterProvider/types';
import {observer}     from 'mobx-react-lite';
import Content from './Content';

const HomePage = observer(() => {
   const {
      securityStore,
   } = useRootStore();
   const navigate = useNavigate();

   useEffect(() => {
      if (!securityStore.loggedIn) {
         navigate(RoutePath.Login);

         return;
      }
   }, [navigate, securityStore]);

   return <Content/>
});

export default HomePage;
