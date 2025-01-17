import {CheckboxOptionType, Layout, Radio, RadioChangeEvent} from 'antd';
import * as UnitUI                                           from '../../components/Unit';
import {formatCurrency}                  from '../../utils/formatCurrency';
import TransactionList                   from '../../container/TransactionList';
import {useRootStore}        from '../../stores/RootStore';
import {useEffect} from 'react';
import {PaymentType}         from '../../stores/CashPointEventStore/types';
import {observer}                                            from 'mobx-react-lite';

// @todo from backend
const paymentTypeOptions: CheckboxOptionType<PaymentType>[] = [{
   label: 'Cash',
   value: 'Cash',
}, {
   label: 'PayPal',
   value: 'PayPal',
}]

const Content = observer(() => {
   const {
      cashPointEventStore,
      transactionStore,
      queuedUnitsStore,
      unitsFormStore
   } = useRootStore();

   const paymentTypeHandler = (ev: RadioChangeEvent) => {
      transactionStore.setPaymentType(ev.target.value);
   }

   useEffect(() => {
      (async() => await transactionStore.open())()

      return () => transactionStore.close();
   }, []);

   return <Layout>
      <Layout.Content>
         {queuedUnitsStore.lastFetchFailed &&
            <p>Daten von externen Geräten (Scannern) konnte nicht geladen werden.</p>}
         {transactionStore.opened && transactionStore.saving && <p>Loading</p>}
         {transactionStore.opened && !transactionStore.saving && <>
            {transactionStore.lastSaveFailed && <p>Fehler beim Speichern</p>}
            <Radio.Group
               block
               options={paymentTypeOptions}
               value={transactionStore.paymentType}
               optionType="button"
               buttonStyle="solid"
               onChange={paymentTypeHandler}
            />
            <UnitUI.List>
               {unitsFormStore.formDataArr.map((formData, i) => <UnitUI.ListItem><UnitUI.Form
                  key={i}
                  autoFocus={unitsFormStore.formDataArr.length === 1}
                  formData={formData}
                  onChange={(newFormValues) => {
                     unitsFormStore.change(i, newFormValues)
                  }}
                  onTouch={(key) => unitsFormStore.touch(i, key)}
               /></UnitUI.ListItem>)}
            </UnitUI.List>
            {!unitsFormStore.changed && unitsFormStore.formDataArr.length > 1 &&  <div>{formatCurrency(transactionStore.amount)}</div>}
            {(transactionStore.changed || unitsFormStore.changed) && !unitsFormStore.empty && unitsFormStore.valid && <button
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
})

export default Content;
