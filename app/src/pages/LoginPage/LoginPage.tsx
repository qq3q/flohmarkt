import React          from 'react';
import LoginForm      from '../../components/LoginForm';
import {observer}     from 'mobx-react-lite';
import {Alert, Flex}  from 'antd';
import {useNavigate}  from 'react-router';
import {RoutePath}    from '../../container/AppRouterProvider/types';
import {useRootStore} from '../../stores/RootStore';

const LoginPage = observer(() => {
   const {securityStore} = useRootStore();
   const [failed, setFailed] = React.useState(false);
   const navigate = useNavigate();

   const loginHandler = async(username: string, password: string) => {

      try {
         await securityStore.login(username, password);
         navigate(RoutePath.Home);
      } catch (e) {
         setFailed(true);
      }
   }

   return <Flex
      vertical
      justify="center"
      align="center"
      style={{height: '100vh'}}
   >
      <LoginForm
         login={loginHandler}
      />
      {failed && <Alert
         message="Nutzername oder Passwort sind nicht korrekt. Bitte erneut propieren!"
         type="error"
      />}
   </Flex>
});

export default LoginPage;
