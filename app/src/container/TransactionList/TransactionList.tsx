import {observer}               from 'mobx-react-lite';
import {useCashPointEventStore} from '../../stores/CashPointEventStore';
import {useMemo}                from 'react';
import {useTransactionStore} from '../../stores/TransactionStore';
import {Button, Flex, List}  from 'antd';

const columns = [{
   title    : 'Erstellt',
   dataIndex: 'createdAt',
   key      : 'createdAt',
}, {
   title    : 'Betrag',
   dataIndex: 'amount',
   key      : 'amount',
}, {
   title    : 'Aktionen',
   dataIndex: 'actions',
   key      : 'actions',
}]

const TransactionList = observer(() => {
   const cashPointStore = useCashPointEventStore();
   const transactionStore = useTransactionStore();
   const eventModel = cashPointStore.eventModel;

   const data = useMemo(() => eventModel.transactionModels.map(t => {
      const canEdit = !transactionStore.dirty && transactionStore.id !== t.data.id;

      return {
         createdAt: t.data.createdAt,
         amount   : t.amount,
         canEdit,
         edit: canEdit ? () => transactionStore.open(t.data) : () => {},
      }
   }), [eventModel, transactionStore.dirty, transactionStore.id])

   return <List
      dataSource={data}
      renderItem={item => {
         return <List.Item>
            <Flex gap="small">
               <Button type="text" disabled={!item.canEdit} onClick={item.edit} style={{width: '6em'}}>
                  {item.amount}
               </Button>
               <Button type="text" disabled={!item.canEdit} onClick={item.edit}>
                  {item.createdAt}
               </Button>
            </Flex>
         </List.Item>
      }}
   />

})

export default TransactionList;
