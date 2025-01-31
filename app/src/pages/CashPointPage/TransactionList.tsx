import React                            from 'react';
import {observer}                       from 'mobx-react-lite';
import {useMemo}                        from 'react';
import {Button, Flex, List, Typography} from 'antd';
import {useRootStore}                   from '../../stores/RootStore';
import {formatCurrency}                 from '../../utils/formatCurrency';
import {ReloadOutlined,}                from '@ant-design/icons';
import {formatTimestamp}                from '../../utils/formatTimestamp';

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
         select:    canSelect ? () => transactionStore.open(t.data) : () => {
         },
      }
   }), [eventModel, transactionStore, unsaved])

   return <>
      <Flex
         justify="space-between"
         align="center"
      >
         <div>
            <Typography.Text strong>
               {cashPointEventStore.eventModel.data.title}
            </Typography.Text>
         </div>
         <Button
            disabled={unsaved}
            type="text"
            shape="circle"
            icon={<ReloadOutlined/>}
            onClick={async() => {
               await cashPointEventStore.sync();
               transactionStore.open();
            }}
         />
      </Flex>
      <List
         size="small"
         bordered={false}
         dataSource={data}
         renderItem={item => {
            return <List.Item
               style={{
                  background: item.selected ? '#e0e0e0' : '',
                  cursor:     item.canSelect ? 'pointer' : 'not-allowed'
               }}
               onClick={item.select}
            >
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
               </Flex>
            </List.Item>
         }}
      /></>

})

export default TransactionList;
