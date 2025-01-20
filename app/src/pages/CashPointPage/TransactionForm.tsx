import {
   Button,
   Card,
   Checkbox,
   CheckboxOptionType,
   Col,
   Layout,
   Radio,
   RadioChangeEvent,
   Result,
   Row,
   Space
}                         from 'antd';
import * as UnitUI
                          from '../../components/Unit';
import {
   formatCurrency
}                         from '../../utils/formatCurrency';
import {
   useRootStore
}                         from '../../stores/RootStore';
import React, {useEffect} from 'react';
import {
   PaymentType
}                         from '../../stores/CashPointEventStore/types';
import {
   observer
}                         from 'mobx-react-lite';
import {
   AddButton,
   AppButton,
   DeleteButton,
   ResetButton,
   SaveButton
}                         from '../../components/buttons';
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

   return <Row gutter={8}>
      <Col xs={24} xl={16}>
         <Card
            title="Zahlung"
            size="small"
            style={{marginBottom: '0.5em'}}
         >
            <Radio.Group
               block
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
      <Col xs={24} xl={8}>
         {!unitsFormStore.changed && unitsFormStore.formDataArr.length > 1 &&
            <Card>
               <Result
                  status="success"
                  title={formatCurrency(transactionStore.amount)}
               />
            </Card>
         }
      </Col>
   </Row>
})

export default TransactionForm;
