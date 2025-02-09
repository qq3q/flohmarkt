import {useRootStore}             from '../../stores/RootStore';
import {Typography} from 'antd';
import {formatCurrency}           from '../../utils/formatCurrency';
import {Table}                    from '../../components/CustomAntd';

const SellerAmountsList = () => {
   const {resultViewStore, cashPointEventStore} = useRootStore();

   return <Table
      title={() => 'Verkäufer'}
      pagination={false}
      rowKey="sellerId"
      dataSource={resultViewStore.sellerAmountsListData}
      columns={[{
         title:     'Verkäufer',
         dataIndex: 'sellerId',
         key:       'sellerId',
         defaultSortOrder: 'ascend',
         sorter: (a, b) => a.sellerId - b.sellerId,
         render:    (_, record) => (record.sellerActive
            ? <Typography.Text>{record.sellerId}</Typography.Text>
            : <Typography.Text
               title="inaktiv"
               type="danger"
            >{record.sellerId}</Typography.Text>)
      }, {
         title:     'Betrag',
         dataIndex: 'amount',
         key:       'amount',
         align: 'right',
         sorter: (a, b) => a.amount - b.amount,
         render: (amount) => formatCurrency(amount),
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

export default SellerAmountsList;