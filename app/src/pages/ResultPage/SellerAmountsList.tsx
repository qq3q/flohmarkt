import {useRootStore}   from '../../stores/RootStore';
import {Typography}     from 'antd';
import {formatCurrency} from '../../utils/formatCurrency';
import {Table}          from '../../components/CustomAntd';
import React            from 'react';
import TableHeader      from './TableHeader';
import {formatNumber}   from '../../utils/formatNumber';

const SellerAmountsList = () => {
   const {
      resultViewStore,
      cashPointEventStore
   } = useRootStore();
   const donationRate = cashPointEventStore.event.donationRate;

   return <Table
      title={() => <TableHeader
         text="Verkäufer"
         onClick={cashPointEventStore.sync}
      />}
      pagination={false}
      rowKey="sellerId"
      dataSource={resultViewStore.sellerAmountsListData}
      columns={[{
         title:            'Verkäufer',
         dataIndex:        'sellerId',
         key:              'sellerId',
         defaultSortOrder: 'ascend',
         sorter:           (a, b) => a.sellerId - b.sellerId,
         render:           (_, record) => (record.sellerActive
            ? <Typography.Text>{record.sellerId}</Typography.Text>
            : <Typography.Text
               title="inaktiv"
               type="danger"
            >{record.sellerId}</Typography.Text>)
      }, {
         title:     'Betrag Verkäufer',
         dataIndex: 'sellerAmount',
         key:       'sellerAmount',
         align:     'right',
         sorter:    (a, b) => a.sellerAmount - b.sellerAmount,
         render:    (sellerAmount) => formatCurrency(sellerAmount),
      }, {
         title:     `Spende ${formatNumber(donationRate * 100)}%`,
         dataIndex: 'donation',
         key:       'donation',
         align:     'right',
         sorter:    (a, b) => a.donation - b.donation,
         render:    (donation) => formatCurrency(donation),
      }, {
         title:     'Betrag Gesamt',
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
               colSpan={3}
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