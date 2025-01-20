import {Alert, Flex}        from 'antd';
import PositiveIntegerInput from '../PositiveIntegerInput';
import {useEffect, useRef}                       from 'react';
import {AMOUNT_BEFORE_ID_WIDTH, SELLER_ID_WIDTH} from './constants';
import {UnitFormData}                            from '../../services/UnitFormService';
import {FormValues, TouchKey} from '../../services/UnitFormService/types';

// @todo add enter submit
const Form = (props: {
   disabled?: boolean,
   formData: UnitFormData,
   onChange: (newFormValues: Partial<FormValues>) => void,
   onTouch: (key: TouchKey) => void,
   autoFocus?: boolean,
}) => {
   const {
      disabled = false,

      formData,
      onChange,
      onTouch,

      // amount,
      autoFocus,
      // restoreAfterReady,
      // updateSyncStatus,
      // onReady
   } = props;

   const ref = useRef<HTMLInputElement>(null);

   useEffect(() => {
      if (autoFocus) {
         ref.current?.focus();
      }
   }, [autoFocus]);

   const errors = formData.validationResult?.getErrors(formData.touched.sellerId, formData.touched.amount) ?? [];

   // @todo ids are not unique if more than one form is used

   return <Flex gap="middle" align="start">
         <PositiveIntegerInput
            ref={ref}
            disabled={disabled}
            style={{width: SELLER_ID_WIDTH}}
            value={formData.formValues.sellerId}
            onBlur={() => {
               if (formData.touched.amount || formData.formValues.sellerId.length > 0) {
                  onTouch('sellerId')
               }
            }}
            onChange={(value: string) => onChange({sellerId: value})}
         />
         <Flex
         gap="small"
         >
         <PositiveIntegerInput
            disabled={disabled}
            style={{width: AMOUNT_BEFORE_ID_WIDTH}}
            suffix="€"
            // addonAfter="Euro"
            value={formData.formValues.beforePointAmount}
            onFocus={() => onTouch('sellerId')}
            onBlur={() => onTouch('beforePointAmount')}
            onChange={(value: string) => onChange({beforePointAmount: value})}
         />
         <strong>,</strong>
         <PositiveIntegerInput
            style={{width: '5em'}}
            disabled={disabled}
            suffix="¢"
            // addonAfter="Cent"
            value={formData.formValues.afterPointAmount}
            onFocus={() => onTouch('sellerId')}
            onBlur={() => onTouch('afterPointAmount')}
            onChange={(value: string) => onChange({afterPointAmount: value})}
         />
         </Flex>
         {errors.length > 0 && <Alert
            message={errors.map(error => <span>{error}</span>)}
            type="error"
            showIcon
         />}
      </Flex>
}

export default Form;
