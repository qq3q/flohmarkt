import React                         from 'react';
import ReactDOM                      from 'react-dom/client';
import './index.css';
import reportWebVitals               from './reportWebVitals';
import {SecurityStoreProvider}       from './stores/SecurityStore';
import AppRouterProvider             from './container/AppRouterProvider';
import {CashPointEventStoreProvider} from './stores/CashPointEventStore';
import {TransactionStoreProvider}    from './stores/TransactionStore';
import {QueuedUnitsStoreProvider}    from './stores/QueuedUnitsStore';
import {ConfigProvider}              from 'antd';
import {themeConfig}                 from './themeConfig';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<React.StrictMode>
   <SecurityStoreProvider>
      <CashPointEventStoreProvider>
         <QueuedUnitsStoreProvider>
            <TransactionStoreProvider>
               <ConfigProvider
                  theme={themeConfig}
               >
                  <AppRouterProvider/>
               </ConfigProvider>
            </TransactionStoreProvider>
         </QueuedUnitsStoreProvider>
      </CashPointEventStoreProvider>
   </SecurityStoreProvider>
</React.StrictMode>);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
