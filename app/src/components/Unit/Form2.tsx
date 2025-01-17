import {Alert, Button, Flex}                               from 'antd';
import {decimalPointSplit}                                 from '../../utils/decimalPointSplit';
import PositiveIntegerInput                                from '../PositiveIntegerInput';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {SELLER_ID_WIDTH}                                   from './constants';
import {UnitFormData}                                      from '../../services/UnitFormService';
import {TouchKey}                                          from '../../services/UnitFormService/types';

interface FormValues {
   sellerId: string,
   beforePointAmount: string,
   afterPointAmount: string,
}

interface Values {
   sellerId: number | null,
   amount: number | null
}

class ValidationResult {
   constructor(public readonly sellerIdErrors: string[], public readonly amountErrors: string[]) {
   }

   get invalid(): boolean {

      return this.sellerIdErrors.length > 0 || this.amountErrors.length > 0;
   }

   get sellerIdInvalid(): boolean {

      return this.sellerIdErrors.length > 0
   }

   get amountInvalid(): boolean {

      return this.amountErrors.length > 0;
   }

   getErrors(includeSellerIdErrors: boolean, includeAmountErrors: boolean): string[] {
      let errors: string[] = includeSellerIdErrors ? this.sellerIdErrors : [];
      if (includeAmountErrors) {
         errors = [...errors, ...this.amountErrors];
      }

      return errors;
   }
}

const validate = (values: Values, validSellerIds: number[]): ValidationResult => {
   const sellerIdErrors: string[] = [];
   const amountErrors: string[] = [];
   if (values.sellerId === null) {
      sellerIdErrors.push('Bitte Verkäufernummer angeben.');
   } else if (!validSellerIds.includes(values.sellerId)) {
      sellerIdErrors.push('Verkäufernummer nicht gefunden.');
   }
   if (values.amount === null) {
      amountErrors.push('Bitte gültigen Betrag angeben.');
   }

   return new ValidationResult(sellerIdErrors, amountErrors);
}

const convertToValues = (values: FormValues) => {
   const sellerId = values.sellerId.length === 0 ? null : Number(values.sellerId);
   let beforePointAmount = values.beforePointAmount.length === 0 ? null : Number(values.beforePointAmount);
   let afterPointAmount = values.afterPointAmount.length === 0 ? null : Number(values.afterPointAmount) / (10 ** values.afterPointAmount.length);
   let amount: number | null = null;
   if (beforePointAmount !== null || afterPointAmount !== null) {
      amount = 0;
      if (beforePointAmount !== null) {
         amount += beforePointAmount;
      }
      if (afterPointAmount !== null) {
         amount += afterPointAmount;
      }
   }
   return {
      sellerId,
      amount
   };
}

const convertToFormValues = (values: Values): FormValues => {
   const [beforePointAmount, afterPointAmount] = values.amount === null ? ['', ''] : decimalPointSplit(values.amount);

   return {
      sellerId: values.sellerId === null ? '' : String(values.sellerId),
      beforePointAmount,
      afterPointAmount
   }
}

const formValuesAreEqual = (a: FormValues, b: FormValues) => {

   return a.sellerId === b.sellerId && a.beforePointAmount === b.beforePointAmount && a.afterPointAmount === b.afterPointAmount;
}

interface TouchedData {
   sellerId: boolean,
   beforePointAmount: boolean,
   afterPointAmount: boolean,
}

// @todo add enter submit
const useTouched = (): [boolean, boolean, (key: keyof TouchedData) => void, () => void] => {
   const initialData: TouchedData = {
      sellerId         : false,
      beforePointAmount: false,
      afterPointAmount : false,
   };
   const [touchedData, setTouchedData] = useState<TouchedData>({...initialData});
   const sellerIdTouched = touchedData.sellerId;
   const amountTouched = touchedData.beforePointAmount || touchedData.afterPointAmount;
   const touch = useCallback((key: keyof TouchedData) => {
      setTouchedData({
                        ...touchedData,
                        [key]: true
                     })
   }, [touchedData]);
   const clearTouch = useCallback(() => {
      setTouchedData({...initialData,})
   }, []);

   return [sellerIdTouched, amountTouched, touch, clearTouch];
}

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

   return <>
      <Flex
         gap="small"
         vertical
      >
         <Flex gap="small">
            <label
               htmlFor="sellerId094353453"
               style={{
                  width: SELLER_ID_WIDTH,
               }}
            >Verk.-nr.</label>
            <label
               htmlFor="beforePointAmount094353453"
            >Betrag</label>
         </Flex>
         <Flex gap="small">
            <PositiveIntegerInput
               ref={ref}
               disabled={disabled}
               id="sellerId094353453"
               style={{width: SELLER_ID_WIDTH}}
               value={formData.formValues.sellerId}
               onBlur={() => {
                  if (formData.touched.amount || formData.formValues.sellerId.length > 0) {
                     onTouch('sellerId')
                  }
               }}
               onChange={(value: string) => onChange({sellerId: value})}
            />
            <PositiveIntegerInput
               id="beforePointAmount094353453"
               disabled={disabled}
               style={{width: '8em'}}
               addonAfter="Euro"
               value={formData.formValues.beforePointAmount}
               onFocus={() => onTouch('sellerId')}
               onBlur={() => onTouch('beforePointAmount')}
               onChange={(value: string) => onChange({beforePointAmount: value})}
            />
            <PositiveIntegerInput
               style={{width: '6.5em'}}
               disabled={disabled}
               addonAfter="Cent"
               value={formData.formValues.afterPointAmount}
               onFocus={() => onTouch('sellerId')}
               onBlur={() => onTouch('afterPointAmount')}
               onChange={(value: string) => onChange({afterPointAmount: value})}
            />
            {/*<Button*/}
            {/*   // disabled={disabled || errors.length > 0}*/}
            {/*   disabled={disabled || validationResult.invalid || unchanged}*/}
            {/*   type="primary"*/}
            {/*   onClick={() => {*/}
            {/*      clearTouch();*/}
            {/*      onReady(values.sellerId ?? 0, values.amount ?? 0);*/}
            {/*      if (restoreAfterReady) {*/}
            {/*         setFormValues(convertToFormValues({*/}
            {/*                                              sellerId,*/}
            {/*                                              amount*/}
            {/*                                           }))*/}
            {/*         autoFocus && ref.current?.focus();*/}
            {/*      }*/}
            {/*   }}*/}
            {/*>{sellerId === null ? 'Hinzufügen' : 'Aktualisieren'}</Button>*/}

         </Flex>
         <div id="test">
            {errors.length > 0 && <Alert
               message={errors.map(error => <span>{error}</span>)}
               type="error"
               showIcon
            />}
         </div>
      </Flex>
   </>
}

export default Form;
