import {observer}                             from 'mobx-react-lite';
import {useMemo}                              from 'react';
import {Button, Card, Flex, List, Typography} from 'antd';
import {useRootStore}                         from '../../stores/RootStore';
import {formatCurrency}                       from '../../utils/formatCurrency';
import {
   EditFilled,
}                                             from '@ant-design/icons';
import {formatTimestamp}                      from '../../utils/formatTimestamp';

const TransactionList = observer(() => {
   const {
      cashPointEventStore,
      transactionStore,
      unitsFormStore,
   } = useRootStore();
   const eventModel = cashPointEventStore.eventModel;
   const unsaved = transactionStore.changed || unitsFormStore.changed;

   const data = useMemo(() => eventModel.transactionModels.map(t => {
      const selected = transactionStore.id === t.data.id;
      const canSelect = !selected && !unsaved;

      return {
         createdAt: t.data.createdAt,
         amount:    t.amount,
         selected,
         canSelect,
         select: canSelect ? () => transactionStore.open(t.data) : () => {
         },
      }
   }), [eventModel, transactionStore.id, unsaved])

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
                     <Typography.Text disabled={!item.canSelect}>
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
                     <Typography.Text disabled={!item.canSelect}>
                        {item.createdAt && formatTimestamp(item.createdAt)}
                     </Typography.Text>
                  </div>
                  <Button
                     disabled={!item.canSelect}
                     type="text"
                     shape="circle"
                     icon={<EditFilled/>}
                     onClick={item.select}
                  />
               </Flex>
            </List.Item>
         }}
      /></>

})

export default TransactionList;
