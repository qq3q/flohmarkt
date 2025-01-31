import {Unit}              from '../../stores/CashPointEventStore/types';
import {decimalPointSplit}                               from '../../utils/decimalPointSplit';
import {FormValues, TouchedData, TouchKey, ParsedValues} from './types';
import {UnitFormDataValidatorResult}                     from './UnitFormDataValidatorResult';
import {QueuedUnit} from '../../stores/QueuedUnitsStore/types';

export class UnitFormData {
   private _formValues: FormValues;
   private _touched: TouchedData;
   public validationResult: UnitFormDataValidatorResult | null;

   constructor(formValues: FormValues = {
      unitId           : null,
      sellerId         : '',
      beforePointAmount: '',
      afterPointAmount : '',
   }) {
      this._formValues = formValues;
      this._touched = {
         sellerId: false,
         amount  : false,
      };
      this.validationResult = null;
   }

   static createFromUnit(unit: Unit): UnitFormData {
      const [beforePointAmount, afterPointAmount] = decimalPointSplit(unit.amount);

      const formValues: FormValues = {
         unitId  : unit.id,
         sellerId: String(unit.sellerId),
         beforePointAmount,
         afterPointAmount
      }

      return new UnitFormData(formValues);
   }

   static createFromQueuedUnit(unit: QueuedUnit): UnitFormData {

      return UnitFormData.createFromUnit({
         ...unit,
         id: null,
      })
   }

   clone(): UnitFormData {
      const form = new UnitFormData();
      form._formValues = this._formValues;
      form._touched = this._touched;
      form.validationResult = this.validationResult;

      return form;
   }

   get parsedValues(): ParsedValues {
      const sellerId = this.formValues.sellerId.length === 0 ? null : Number(this.formValues.sellerId);
      const beforePointAmount = this.formValues.beforePointAmount.length === 0 ? null : Number(this.formValues.beforePointAmount);
      const afterPointAmount = this.formValues.afterPointAmount.length === 0 ? null : Number(this.formValues.afterPointAmount) / (10 ** this.formValues.afterPointAmount.length);
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

   get unit(): Unit {
      const {sellerId, amount} = this.parsedValues;
      if (sellerId === null) {

         throw new Error('sellerId is null');
      }
      if(amount === null) {

         throw new Error('amount is null');
      }

      return {
         id: this.formValues.unitId,
         sellerId,
         amount
      };
   }

   get formValues(): FormValues {

      return this._formValues;
   }

   get touched(): TouchedData {

      return this._touched;
   }

   equalFormValues(b: FormValues) {
      const a = this._formValues;

      return a.unitId === b.unitId
         && a.sellerId === b.sellerId
         && a.beforePointAmount === b.beforePointAmount
         && a.afterPointAmount === b.afterPointAmount;
   }

   get blank(): boolean {

      return this.formValues.sellerId.length === 0
         && this.formValues.beforePointAmount.length === 0
         && this.formValues.afterPointAmount.length === 0;
   }

   get valid(): boolean {
      return this.validationResult !== null && this.validationResult.valid
   }

   change(newFormValues: Partial<FormValues>): void {
      this._formValues = {...this._formValues, ...newFormValues};
      this.validationResult = null;
   }

   touch(key: TouchKey) {
      switch (key) {
         case 'sellerId':
            this._touched.sellerId = true;
            break;
         case "beforePointAmount":
         case "afterPointAmount":
            this._touched.amount = true;
            break;
         default:

            throw new Error('Unsupported key.');
      }
   }
}