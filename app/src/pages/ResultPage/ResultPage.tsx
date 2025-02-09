import {useRootStore}     from '../../stores/RootStore';
import React              from 'react';
import {observer}         from 'mobx-react-lite';
import {usePageLauncher}  from './usePageLauncher';
import {Layout}           from '../../components/AppLayout';
import * as Alert         from '../../components/alerts';
import SellerAmountsList  from './SellerAmountsList';
import PaymentAmountsList from './PaymentAmountsList';
import {Col,}             from 'antd';
import {Row}              from '../../components/CustomAntd';

const ResultPage = observer(() => {
   usePageLauncher();
   const {
      cashPointEventStore,
   } = useRootStore();

   if (cashPointEventStore.status === 'syncing'
      || cashPointEventStore.status === 'not_synced') {

      return <Layout>
         <Layout.Content>
            <Layout.ContentLoading/>
         </Layout.Content>
      </Layout>
   }

   if (cashPointEventStore.status === 'synced') {

      return <Layout>
         <Layout.Content>
            <Row>
               <Col span={12}>
                  <SellerAmountsList/>
               </Col>
               <Col span={12}>
                  <PaymentAmountsList/>
               </Col>
            </Row>
         </Layout.Content>
      </Layout>
   }

   // cashPointEventStore.status === 'sync_failed'
   return <Layout>
      <Layout.Content>
         <Alert.Error description="Die Veranstaltung konnte nicht geladen werden."/>
      </Layout.Content>
   </Layout>
});

export default ResultPage;
