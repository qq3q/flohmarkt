import React     from 'react';
import LoginForm from '../../components/LoginForm';
import {observer}         from 'mobx-react-lite';
import {useSecurityStore} from '../../stores/SecurityStore';
import {Alert}                 from 'antd';
import {useNavigate} from 'react-router';
import {RoutePath} from '../../container/AppRouterProvider/types';

const LoginPage = observer(() => {
   const securityStore = useSecurityStore();
   const [failed, setFailed] = React.useState(false);
   const navigate = useNavigate();

   const loginHandler = async (username: string, password: string) => {

      try {
         await securityStore.login(username, password);
         navigate(RoutePath.Home);
      } catch (e) {
         setFailed(true);
      }
   }

   return <>
      <div>Login</div>
      <LoginForm
         login={loginHandler}
      />
      {failed && <Alert message="Nutzername oder Passwort sind nicht korrekt. Bitte erneut propieren!" type="error" />}
   </>
});

export default LoginPage;
