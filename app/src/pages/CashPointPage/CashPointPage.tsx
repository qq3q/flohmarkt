import {observer} from 'mobx-react-lite';
import {CheckboxOptionType, Layout, Radio, RadioChangeEvent} from 'antd';
import * as UnitUI from '../../components/Unit';
import {formatCurrency} from '../../utils/formatCurrency';
import {PaymentType} from '../../stores/CashPointEventStore/types';
import {useEffect, useState} from 'react';
import TransactionList from '../../container/TransactionList';
import {useRootStore} from '../../stores/RootStore';

// @todo from backend
const paymentTypeOptions: CheckboxOptionType<PaymentType>[] = [{
   label: 'Cash',
   value: 'Cash',
}, {
   label: 'PayPal',
   value: 'PayPal',
}]

// used to force rendering of the forms after a reset
const useFormKey = (): [(index: number) => string, () => void] => {
   const [prefix, setPrefixKey] = useState<number>(0);
   const getFormKey = (index: number): string => `${prefix}-${index}`;
   const nextUniqueFormKey = () => setPrefixKey(prefix + 1);

   return [getFormKey, nextUniqueFormKey];
}

const CashPointPage = observer(() => {
   const {
      cashPointEventStore,
      transactionStore,
      queuedUnitsStore,
      unitsFormStore
   } = useRootStore();
   const [getFormKey, nextUniqueFormKey] = useFormKey();

   const paymentTypeHandler = (ev: RadioChangeEvent) => {
      transactionStore.setPaymentType(ev.target.value);
   }

   // const [activeRowInd, setActiveRowInd] = useState<number | null>(null);

   // console.log('activeRowInd', activeRowInd)

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

   switch (cashPointEventStore.status) {
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
                     // disabled={transactionStore.readOnly}
                     options={paymentTypeOptions}
                     value={transactionStore.paymentType}
                     optionType="button"
                     buttonStyle="solid"
                     onChange={paymentTypeHandler}
                  />
                  <UnitUI.List>
                     {unitsFormStore.formDataArr.map((formData, i) => <UnitUI.ListItem><UnitUI.Form
                        key={getFormKey(i)}
                        autoFocus={unitsFormStore.formDataArr.length === 1}
                        // disabled={transactionStore.readOnly /*|| (activeRowInd !== null && activeRowInd !== i)*/}
                        formData={formData}
                        onChange={(newFormValues) => {
                           console.log('onChange', newFormValues)
                           unitsFormStore.change(i, newFormValues)
                        }}
                        onTouch={(key) => unitsFormStore.touch(i, key)}
                        // validSellerIds={cashPointEventStore.sellerIds}
                        // updateSyncStatus={(synced) => setActiveRowInd(synced ? null : i)}
                        // onReady={(sellerId, amount) => {
                        //    transactionStore.updateUnit(i, sellerId, amount);
                        //    setActiveRowInd(null);
                        // }}
                     /></UnitUI.ListItem>)}
                  </UnitUI.List>
                  {!unitsFormStore.changed && unitsFormStore.formDataArr.length > 1 &&  <div>{formatCurrency(transactionStore.amount)}</div>}
                  {(transactionStore.changed || unitsFormStore.changed) && !unitsFormStore.empty && unitsFormStore.valid && <button
                     // disabled={!unitsFormStore.changed || !unitsFormStore.valid}
                     onClick={async() => {
                        transactionStore.updateFromForm();
                        await transactionStore.save();
                        if (!transactionStore.lastSaveFailed) {
                           // transactionStore.open();
                           await cashPointEventStore.sync();
                        }
                     }}
                  >Speichern
                  </button>}
                  {(transactionStore.changed || unitsFormStore.changed) && <button
                     // disabled={!unitsFormStore.changed}
                     onClick={() => {
                        transactionStore.reset();
                        // force rendering of the forms
                        // nextUniqueFormKey();
                     }}
                  >Zurücksetzen
                  </button>}
                  {!transactionStore.changed && !unitsFormStore.changed && unitsFormStore.formDataArr.length > 1 && <button
                     onClick={() => transactionStore.open()}
                  >Neu
                  </button>}
                  {!unitsFormStore.changed && transactionStore.id !== null && <button>Löschen</button>}
               </>}
            </Layout.Content>
            <Layout.Sider>
               Title: {cashPointEventStore.eventModel.data.title}
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
