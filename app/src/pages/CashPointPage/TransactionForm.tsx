import {
   Card,
   CheckboxOptionType,
   Col,
   Radio,
   RadioChangeEvent,
   Result,
   Row,
   Space
} from 'antd';
import * as UnitUI
   from '../../components/Unit';
import {
   formatCurrency
} from '../../utils/formatCurrency';
import {
   useRootStore
} from '../../stores/RootStore';
import React from 'react';
import {
   PaymentType
} from '../../stores/CashPointEventStore/types';
import {
   observer
} from 'mobx-react-lite';
import {
   AddButton,
   ResetButton,
   SaveButton
} from '../../components/buttons';
import DeleteConfirmButton
   from '../../components/DeleteConfirmButton/DeleteConfirmButton';

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

   const showPrice = !unitsFormStore.changed && unitsFormStore.formDataArr.length > 1

   return <Row gutter={8}>
      <Col
         xs={24}
         xl={showPrice ? 16 : 24}
      >
         <Card
            title="Zahlung"
            size="small"
            style={{marginBottom: '0.5em'}}
         >
            <Radio.Group
               options={paymentTypeOptions}
               value={transactionStore.paymentType}
               optionType="button"
               size="small"
               onChange={paymentTypeHandler}
            />
         </Card>
         <Card
            title="Beträge"
            size="small"
         >
            <UnitUI.List>
               <UnitUI.ListItem>
                  <UnitUI.FormHead/>
               </UnitUI.ListItem>
               {unitsFormStore.formDataArr.map((formData, i) => <UnitUI.ListItem key={i}><UnitUI.Form
                  autoFocus={unitsFormStore.formDataArr.length === 1}
                  formData={formData}
                  onChange={(newFormValues) => {
                     unitsFormStore.change(i, newFormValues)
                  }}
                  onTouch={(key) => unitsFormStore.touch(i, key)}
               /></UnitUI.ListItem>)}
            </UnitUI.List>
            <Space style={{marginTop: '0.5em'}}>
               {(transactionStore.changed || unitsFormStore.changed) && !unitsFormStore.empty && unitsFormStore.valid &&
                  <SaveButton
                     onClick={async() => {
                        transactionStore.updateFromForm();
                        await transactionStore.save();
                        if (!transactionStore.lastSaveFailed) {
                           await cashPointEventStore.sync();
                        }
                     }}
                  />}
               {(transactionStore.changed || unitsFormStore.changed) && <ResetButton
                  onClick={() => {
                     transactionStore.reset();
                  }}
               />}
               {!transactionStore.changed && !unitsFormStore.changed && unitsFormStore.formDataArr.length > 1 &&
                  <AddButton
                     onClick={() => transactionStore.open()}
                  />}
               {!unitsFormStore.changed && transactionStore.id !== null && <DeleteConfirmButton
                  onClick={async() => {
                     await transactionStore.delete();
                     if (!transactionStore.lastDeleteFailed) {
                        await cashPointEventStore.sync();
                        transactionStore.open();
                     }
                  }}
               />}
            </Space>
         </Card>
      </Col>
      {showPrice &&
         <Col
            xs={24}
            xl={8}
         >
            <Card>
               <Result
                  status="success"
                  title={formatCurrency(transactionStore.amount)}
               />
            </Card>
         </Col>
      }
   </Row>
})

export default TransactionForm;
