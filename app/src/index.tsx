import React               from 'react';
import ReactDOM            from 'react-dom/client';
import './index.css';
import reportWebVitals     from './reportWebVitals';
import AppRouterProvider   from './container/AppRouterProvider';
import {ConfigProvider}    from 'antd';
import {themeConfig}       from './themeConfig';
import {RootStoreProvider} from './stores/RootStore';
import Launcher            from './container/Launcher';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<React.StrictMode>
   <RootStoreProvider>
      <ConfigProvider
         theme={themeConfig}
      >
         <Launcher>
            <AppRouterProvider/>
         </Launcher>
      </ConfigProvider>
   </RootStoreProvider>
</React.StrictMode>);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
