import {CheckboxOptionType, Layout, Radio, RadioChangeEvent} from 'antd';
import * as UnitUI                                           from '../../components/Unit';
import {formatCurrency}                                      from '../../utils/formatCurrency';
import {useRootStore}                                        from '../../stores/RootStore';
import {useEffect}                                           from 'react';
import {PaymentType}                                         from '../../stores/CashPointEventStore/types';
import {observer}                                            from 'mobx-react-lite';

// @todo from backend
const paymentTypeOptions: CheckboxOptionType<PaymentType>[] = [{
   label: 'Cash',
   value: 'Cash',
}, {
   label: 'PayPal',
   value: 'PayPal',
}]

const TransactionForm = observer(() => {
   const {
      cashPointEventStore,
      transactionStore,
      unitsFormStore
   } = useRootStore();

   const paymentTypeHandler = (ev: RadioChangeEvent) => {
      transactionStore.setPaymentType(ev.target.value);
   }

   return <>
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
      {!unitsFormStore.changed && unitsFormStore.formDataArr.length > 1 &&
         <div>{formatCurrency(transactionStore.amount)}</div>}
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
   </>
})

export default TransactionForm;
