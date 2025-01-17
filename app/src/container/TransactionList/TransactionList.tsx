import {observer}               from 'mobx-react-lite';
import {useMemo}             from 'react';
import {Button, Flex, List}  from 'antd';
import {useRootStore}           from '../../stores/RootStore';

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
   const {cashPointEventStore, transactionStore} = useRootStore();
   const eventModel = cashPointEventStore.eventModel;

   const data = useMemo(() => eventModel.transactionModels.map(t => {
      const canEdit = transactionStore.id !== t.data.id;

      return {
         createdAt: t.data.createdAt,
         amount   : t.amount,
         canEdit,
         edit: canEdit ? () => transactionStore.open(t.data) : () => {},
      }
   }), [eventModel, transactionStore.id])

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
