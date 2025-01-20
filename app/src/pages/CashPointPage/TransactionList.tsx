import {observer}                             from 'mobx-react-lite';
import {useMemo}                              from 'react';
import {Button, Card, Flex, List, Typography} from 'antd';
import {useRootStore}                         from '../../stores/RootStore';
import {formatCurrency}                       from '../../utils/formatCurrency';
import {
   EditFilled,
}                                             from '@ant-design/icons';
import {formatTimestamp}                      from '../../utils/formatTimestamp';

const columns = [{
   title:     'Erstellt',
   dataIndex: 'createdAt',
   key:       'createdAt',
}, {
   title:     'Betrag',
   dataIndex: 'amount',
   key:       'amount',
}, {
   title:     'Aktionen',
   dataIndex: 'actions',
   key:       'actions',
}]

const TransactionList = observer(() => {
   const {
      cashPointEventStore,
      transactionStore
   } = useRootStore();
   const eventModel = cashPointEventStore.eventModel;

   const data = useMemo(() => eventModel.transactionModels.map(t => {
      const selected = transactionStore.id === t.data.id;
      const canSelect = !selected;

      return {
         createdAt: t.data.createdAt,
         amount:    t.amount,
         selected,
         canEdit:   canSelect,
         edit:      canSelect ? () => transactionStore.open(t.data) : () => {
         },
      }
   }), [eventModel, transactionStore.id])

   return <>
      <Typography.Title level={5}>
         {'Transaktionen ' + cashPointEventStore.eventModel.data.title}
      </Typography.Title>
      <List
         size="small"
         bordered={false}
         dataSource={data}
         renderItem={item => {
            return <List.Item>
               <Flex
                  gap="small"
                  align="center"
               >
                  <div
                     style={{
                        width:     '6em',
                        textAlign: 'right',
                        overflow:  'hidden'
                     }}
                  >
                     <Typography.Text disabled={!item.canEdit}>
                        {formatCurrency(item.amount)}
                     </Typography.Text>
                  </div>
                  <div
                     style={{
                        width:     '10em',
                        textAlign: 'right',
                        overflow:  'hidden'
                     }}
                  >
                     <Typography.Text disabled={!item.canEdit}>
                        {item.createdAt && formatTimestamp(item.createdAt)}
                     </Typography.Text>
                  </div>
                  <Button
                     disabled={!item.canEdit}
                     type="text"
                     shape="circle"
                     icon={<EditFilled/>}
                     onClick={item.edit}
                  />
               </Flex>
            </List.Item>
         }}
      /></>

})

export default TransactionList;
