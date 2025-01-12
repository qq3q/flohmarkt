import {observer}                                            from 'mobx-react-lite';
import {useCashPointEventStore}                              from '../../stores/CashPointEventStore';
import {useTransactionStore}                                 from '../../stores/TransactionStore';
import {CheckboxOptionType, Layout, Radio, RadioChangeEvent} from 'antd';
import * as UnitUI                                           from '../../components/Unit';
import {formatCurrency}                                      from '../../utils/formatCurrency';
import {PaymentType}                                         from '../../stores/CashPointEventStore/types';
import {useEffect}                                           from 'react';
import TransactionList                                       from '../../container/TransactionList';
import {useQueuedUnitsStore}                                 from '../../stores/QueuedUnitsStore';

// @todo from backend
const paymentTypeOptions: CheckboxOptionType<PaymentType>[] = [{
   label: 'Cash',
   value: 'Cash',
}, {
   label: 'PayPal',
   value: 'PayPal',
}]

const CashPointPage = observer(() => {
   const cashPointStore = useCashPointEventStore();
   const transactionStore = useTransactionStore();
   const queuedUnitsStore = useQueuedUnitsStore();

   const paymentTypeHandler = (ev: RadioChangeEvent) => {
      transactionStore.setPaymentType(ev.target.value);
   }

   useEffect(() => {
      (async() => {
         await transactionStore.open();
         // await queuedUnitsStore.start();
      })()

      return () => {
         // queuedUnitsStore.stop();
         transactionStore.close();
      }
   }, []);

   switch (cashPointStore.status) {
      case 'syncing':
         return <>Loading...</>;
      case 'synced':
         return <Layout>
            <Layout.Content>
               {queuedUnitsStore.lastFetchFailed &&
                  <p>Daten von externen Geräten (Scannern) konnte nicht geladen werden.</p>}
               {transactionStore.opened && transactionStore.saving && <p>Loading</p>}
               {transactionStore.opened && !transactionStore.saving && <>
                  {transactionStore.lastSaveFailed && <p>Fehler beim Speichern</p>}
                  <Radio.Group
                     block
                     disabled={transactionStore.readOnly}
                     options={paymentTypeOptions}
                     value={transactionStore.paymentType}
                     optionType="button"
                     buttonStyle="solid"
                     onChange={paymentTypeHandler}
                  />
                  <UnitUI.List>
                     {transactionStore.units.map((unit, i) => <UnitUI.ListItem key={i}><UnitUI.Form
                        disabled={transactionStore.readOnly}
                        amount={unit.amount}
                        sellerId={unit.sellerId}
                        validSellerIds={cashPointStore.sellerIds}
                        onReady={(sellerId, amount) => transactionStore.updateUnit(i, sellerId, amount)}
                     /></UnitUI.ListItem>)}
                  </UnitUI.List>
                  {!transactionStore.readOnly && <UnitUI.Form
                     amount={null}
                     sellerId={null}
                     validSellerIds={cashPointStore.sellerIds}
                     autoFocus
                     restoreAfterReady
                     onReady={transactionStore.addUnit}
                  />}
                  {transactionStore.readOnly && <div>{formatCurrency(transactionStore.amount)}</div>}
                  {!transactionStore.readOnly && <button
                     disabled={!transactionStore.dirty}
                     onClick={async() => {
                        await transactionStore.save();
                        if (!transactionStore.lastSaveFailed) {
                           // transactionStore.open();
                           await cashPointStore.sync();
                        }
                     }}
                  >Speichern
                  </button>}
                  {!transactionStore.readOnly && <button
                     disabled={!transactionStore.dirty}
                     onClick={() => transactionStore.reset()}
                  >Zurücksetzen
                  </button>}
                  {transactionStore.readOnly && <button
                     disabled={transactionStore.dirty}
                     onClick={() => transactionStore.open()}
                  >Neu
                  </button>}
                  {transactionStore.readOnly && transactionStore.id !== null && <button>Löschen</button>}
                  {transactionStore.readOnly && <button onClick={() => transactionStore.setReadOnly(false)}>
                     Bearbeiten
                  </button>}
               </>}
            </Layout.Content>
            <Layout.Sider>
               Title: {cashPointStore.eventModel.data.title}
               <TransactionList/>
            </Layout.Sider>
         </Layout>
   }

   return <>
      <div>CashPoint Page</div>
      {/*<List/>*/}
   </>
})

export default CashPointPage;
