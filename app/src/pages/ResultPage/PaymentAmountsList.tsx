import {useRootStore}    from '../../stores/RootStore';
import {formatCurrency}  from '../../utils/formatCurrency';
import {getPaymentTitle} from '../../utils/paymentTitle';
import {Table}           from '../../components/CustomAntd';
import {Typography}      from 'antd';
import TableHeader       from './TableHeader';
import React             from 'react';

const PaymentAmountsList = () => {
   const {
      resultViewStore,
      cashPointEventStore
   } = useRootStore();

   return <Table
      title={() => <TableHeader text="Zahlungsarten" onClick={cashPointEventStore.sync}/>}
      pagination={false}
      rowKey="paymentType"
      dataSource={resultViewStore.paymentTypeListData}
      columns={[{
         title:            'Zahlungsart',
         dataIndex:        'paymentType',
         key:              'paymentType',
         defaultSortOrder: 'ascend',
         sorter:           (a, b) => {
            const aa = getPaymentTitle(a.paymentType);
            const bb = getPaymentTitle(b.paymentType);
            return aa < bb
               ? -1
               : (aa > bb ? 1 : 0)
         },
         render:           (paymentType) => getPaymentTitle(paymentType),
      }, {
         title:     'Betrag',
         dataIndex: 'amount',
         key:       'amount',
         align:     'right',
         sorter:    (a, b) => a.amount - b.amount,
         render:    (amount) => formatCurrency(amount),
      }]}
      summary={(_) => (
         <Table.Summary.Row>
            <Table.Summary.Cell
               index={0}
            >
               <Typography.Text strong>
                  Gesamt
               </Typography.Text>
            </Table.Summary.Cell>
            <Table.Summary.Cell
               index={1}
               align="right"
            >
               <Typography.Text strong>
                  {formatCurrency(cashPointEventStore.totalAmount)}
               </Typography.Text>
            </Table.Summary.Cell>
         </Table.Summary.Row>
      )}
   />
}

export default PaymentAmountsList;