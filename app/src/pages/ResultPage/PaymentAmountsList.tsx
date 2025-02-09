import {useRootStore}    from '../../stores/RootStore';
import {formatCurrency}  from '../../utils/formatCurrency';
import {getPaymentTitle} from '../../utils/paymentTitle';
import {Table}           from '../../components/CustomAntd';

const PaymentAmountsList = () => {
   const {resultViewStore} = useRootStore();

   return <Table
      title={() => 'Zahlungsarten'}
      pagination={false}
      rowKey="sellerId"
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
   />
}

export default PaymentAmountsList;